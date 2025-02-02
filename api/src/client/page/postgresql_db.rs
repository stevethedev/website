use crate::client::page::{CreatePage, FilterPage, Page, PageClient, UpdatePage};
use crate::client::{Client, Command, Error, Result};
use sqlx::{query_as, PgPool};
use std::sync::Arc;

#[async_trait::async_trait]
impl Client<Arc<PgPool>> for PageClient<Arc<PgPool>> {
    fn backend(&self) -> Arc<PgPool> {
        self.backend.clone()
    }
}

impl From<Arc<PgPool>> for PageClient<Arc<PgPool>> {
    fn from(backend: Arc<PgPool>) -> Self {
        Self { backend }
    }
}

#[async_trait::async_trait]
impl Command<Arc<PgPool>> for FilterPage {
    type Client = PageClient<Arc<PgPool>>;
    type Output = Vec<Page>;

    async fn execute(self, backend: Arc<PgPool>) -> Result<Self::Output> {
        query_as!(
            Page,
            r#"
                SELECT id, title, content, path
                FROM page
                WHERE (
                    ($1::int IS NULL OR id = $1) AND
                    ($2::text IS NULL OR path = $2)
                )
                LIMIT $3
                OFFSET $4
            "#,
            self.fields.id,
            self.fields.path,
            self.pagination
                .as_ref()
                .and_then(|p| p.limit.map(|l| l as i64))
                .unwrap_or(1000),
            self.pagination
                .and_then(|p| p.offset.map(|o| o as i64))
                .unwrap_or_default(),
        )
        .fetch_all(&*backend)
        .await
        .map_err(Error::from)
    }
}

#[async_trait::async_trait]
impl Command<Arc<PgPool>> for CreatePage {
    type Client = PageClient<Arc<PgPool>>;
    type Output = ();

    async fn execute(self, backend: Arc<PgPool>) -> Result<Self::Output> {
        query_as!(
            Page,
            r#"
                INSERT INTO page (title, content, path)
                VALUES ($1, $2, $3)
            "#,
            self.title,
            self.content,
            self.path,
        )
        .fetch_all(&*backend)
        .await
        .map(|_| ())
        .map_err(Error::from)
    }
}

#[async_trait::async_trait]
impl Command<Arc<PgPool>> for UpdatePage {
    type Client = PageClient<Arc<PgPool>>;
    type Output = ();

    async fn execute(self, backend: Arc<PgPool>) -> Result<Self::Output> {
        query_as!(
            Page,
            r#"
                UPDATE page
                SET title = $1, content = $2, path = $3
                WHERE (
                    ($4::int IS NULL OR id = $4) AND
                    ($5::text IS NULL OR path = $5)
                )
            "#,
            self.title,
            self.content,
            self.path,
            self.filter.fields.id,
            self.filter.fields.path,
        )
        .fetch_all(&*backend)
        .await
        .map(|_| ())
        .map_err(Error::from)
    }
}
