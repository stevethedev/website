use crate::client::page::{CreatePage, FilterPage, Page, PageClient, UpdatePage};
use crate::client::{Client, Command, Error, Result};
use std::sync::{Arc, RwLock};

#[async_trait::async_trait]
impl Client<Arc<RwLock<Vec<Page>>>> for PageClient<Arc<RwLock<Vec<Page>>>> {
    fn backend(&self) -> Arc<RwLock<Vec<Page>>> {
        self.backend.clone()
    }
}

impl From<Arc<RwLock<Vec<Page>>>> for PageClient<Arc<RwLock<Vec<Page>>>> {
    fn from(backend: Arc<RwLock<Vec<Page>>>) -> Self {
        Self { backend }
    }
}

#[async_trait::async_trait]
impl Command<Arc<RwLock<Vec<Page>>>> for FilterPage {
    type Client = PageClient<Arc<RwLock<Vec<Page>>>>;
    type Output = Vec<Page>;

    async fn execute(self, backend: Arc<RwLock<Vec<Page>>>) -> Result<Self::Output> {
        backend.read().map_err(Error::from).map(|backend| {
            backend
                .iter()
                .skip(
                    self.pagination
                        .as_ref()
                        .and_then(|p| p.offset)
                        .unwrap_or_default() as usize,
                )
                .take(self.pagination.and_then(|p| p.limit).unwrap_or(u64::MAX) as usize)
                .filter(|&page| self.fields.id.is_none() || self.fields.id == Some(page.id))
                .filter(|&page| {
                    self.fields.path.is_none() || self.fields.path.as_ref() == Some(&page.path)
                })
                .cloned()
                .collect()
        })
    }
}

#[async_trait::async_trait]
impl Command<Arc<RwLock<Vec<Page>>>> for CreatePage {
    type Client = PageClient<Arc<RwLock<Vec<Page>>>>;
    type Output = ();

    async fn execute(self, backend: Arc<RwLock<Vec<Page>>>) -> Result<Self::Output> {
        let mut backend = backend.write().map_err(Error::from)?;
        let id = backend.len() as i32 + 1;
        let page = Page {
            id,
            title: self.title,
            content: self.content,
            path: self.path,
        };
        backend.push(page);
        Ok(())
    }
}

#[async_trait::async_trait]
impl Command<Arc<RwLock<Vec<Page>>>> for UpdatePage {
    type Client = PageClient<Arc<RwLock<Vec<Page>>>>;
    type Output = ();

    async fn execute(self, backend: Arc<RwLock<Vec<Page>>>) -> Result<Self::Output> {
        let mut backend = backend.write().map_err(Error::from)?;
        for page in backend.iter_mut() {
            if self.filter.fields.id.is_none() || self.filter.fields.id == Some(page.id) {
                if let Some(title) = &self.title {
                    page.title = title.clone();
                }
                if let Some(path) = &self.path {
                    page.path = path.clone();
                }
                if let Some(content) = &self.content {
                    page.content = content.clone();
                }
            }
        }
        Ok(())
    }
}
