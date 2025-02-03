use super::{Account, AccountClient, GetAccount, Login, PasswordedAccount};
use crate::client::{Client, Command, Error};
use sqlx::{query_as, PgPool};
use std::sync::Arc;

#[async_trait::async_trait]
impl Client<Arc<PgPool>> for AccountClient<Arc<PgPool>> {
    fn backend(&self) -> Arc<PgPool> {
        self.backend.clone()
    }
}

impl From<Arc<PgPool>> for AccountClient<Arc<PgPool>> {
    fn from(backend: Arc<PgPool>) -> Self {
        Self { backend }
    }
}

#[async_trait::async_trait]
impl Command<Arc<PgPool>> for Login {
    type Client = AccountClient<Arc<PgPool>>;
    type Output = Option<Account>;

    async fn execute(self, backend: Arc<PgPool>) -> crate::client::Result<Self::Output> {
        query_as!(
            PasswordedAccount,
            r#"
                SELECT id, username, password_hash, display_name
                FROM account
                WHERE username = $1
                LIMIT 1;
            "#,
            self.username
        )
        .fetch_optional(&*backend)
        .await
        .map_err(Error::from)
        .map(move |maybe_account| {
            maybe_account.and_then(|account| account.check_password(&self.password))
        })
    }
}

#[async_trait::async_trait]
impl Command<Arc<PgPool>> for GetAccount {
    type Client = AccountClient<Arc<PgPool>>;
    type Output = Option<Account>;

    async fn execute(self, backend: Arc<PgPool>) -> crate::client::Result<Self::Output> {
        query_as!(
            Account,
            r#"
                SELECT id, username, display_name
                FROM account
                WHERE id = $1
                LIMIT 1;
            "#,
            self.id
        )
        .fetch_optional(&*backend)
        .await
        .map_err(Error::from)
    }
}
