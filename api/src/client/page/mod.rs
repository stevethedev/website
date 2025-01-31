use super::Client;
use std::sync::{Arc, RwLock};

pub struct PageClient<TBackend>
where
    TBackend: Send + Sync,
{
    backend: TBackend,
}

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

#[derive(Clone)]
pub struct Page {
    pub id: u32,
    pub title: String,
    pub body: String,
}

impl Into<crate::schema::page::Page> for Page {
    fn into(self) -> crate::schema::page::Page {
        crate::schema::page::Page {
            title: self.title,
            body: self.body,
        }
    }
}

#[derive(Default)]
pub struct Fields {
    pub id: Option<u32>,
    pub title: Option<String>,
    pub body: Option<String>,
}

#[derive(Default)]
pub struct FilterPage {
    pub fields: Fields,
}

#[async_trait::async_trait]
impl super::Command for FilterPage {
    type Client = PageClient<Self::Backend>;
    type Backend = Arc<RwLock<Vec<Page>>>;
    type Output = Vec<Page>;

    async fn execute(&self, backend: Self::Backend) -> super::Result<Self::Output> {
        backend.read().map_err(super::Error::from).map(|backend| {
            backend
                .iter()
                .filter(|page| self.fields.id.is_none() || self.fields.id == Some(page.id))
                .filter(|page| {
                    self.fields.title.is_none() || self.fields.title == Some(page.title.clone())
                })
                .filter(|page| {
                    self.fields.body.is_none() || self.fields.body == Some(page.body.clone())
                })
                .cloned()
                .collect()
        })
    }
}

pub struct CreatePage {
    title: String,
    body: String,
}
#[async_trait::async_trait]

impl super::Command for CreatePage {
    type Client = PageClient<Self::Backend>;
    type Backend = Arc<RwLock<Vec<Page>>>;
    type Output = Page;

    async fn execute(&self, backend: Self::Backend) -> super::Result<Self::Output> {
        let mut backend = backend.write().map_err(super::Error::from)?;
        let id = backend.len() as u32 + 1;
        let page = Page {
            id,
            title: self.title.clone(),
            body: self.body.clone(),
        };
        backend.push(page.clone());
        Ok(page)
    }
}

pub struct UpdatePage {
    filter: FilterPage,
    title: Option<String>,
    body: Option<String>,
}
#[async_trait::async_trait]

impl super::Command for UpdatePage {
    type Client = PageClient<Self::Backend>;
    type Backend = Arc<RwLock<Vec<Page>>>;
    type Output = ();

    async fn execute(&self, backend: Self::Backend) -> super::Result<Self::Output> {
        let mut backend = backend.write().map_err(super::Error::from)?;
        for page in backend.iter_mut() {
            if self.filter.fields.id.is_none() || self.filter.fields.id == Some(page.id) {
                if let Some(title) = &self.title {
                    page.title = title.clone();
                }
                if let Some(body) = &self.body {
                    page.body = body.clone();
                }
            }
        }
        Ok(())
    }
}
