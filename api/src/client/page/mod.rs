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
    pub path: String,
    pub title: String,
    pub content: String,
}

impl Into<crate::schema::page::Page> for Page {
    fn into(self) -> crate::schema::page::Page {
        crate::schema::page::Page {
            content: self.content,
            path: self.path,
            title: self.title,
        }
    }
}

#[derive(Clone, Default)]
pub struct Fields {
    pub id: Option<u32>,
    pub title: Option<String>,
    pub path: Option<String>,
    pub content: Option<String>,
}

#[derive(Clone, Default)]
pub struct FilterPage {
    pub fields: Fields,
}

impl FilterPage {
    /// Sets the ID field.
    ///
    /// # Parameters
    ///
    /// - `id` - The ID to filter by.
    ///
    /// # Returns
    ///
    /// The updated `FilterPage` object.
    ///
    /// # Examples
    ///
    /// ```
    /// let filter = FilterPage::default().field_id(42);
    /// # assert_eq!(filter.fields.id, Some(42));
    /// ```
    pub fn field_id(mut self, id: impl Into<Option<u32>>) -> Self {
        self.fields.id = id.into();
        self
    }

    /// Sets the title field.
    ///
    /// # Parameters
    ///
    /// - `title` - The title to filter by.
    ///
    /// # Returns
    ///
    /// The updated `FilterPage` object.
    ///
    /// # Examples
    ///
    /// ```
    /// let filter = FilterPage::default().field_title("Hello, world!");
    /// # assert_eq!(filter.fields.title, Some("Hello, world!".to_string()));
    /// ```
    pub fn field_title(mut self, title: impl Into<Option<String>>) -> Self {
        self.fields.title = title.into();
        self
    }

    /// Sets the path field.
    ///
    /// # Parameters
    ///
    /// - `path` - The path to filter by.
    ///
    /// # Returns
    ///
    /// The updated `FilterPage` object.
    ///
    /// # Examples
    ///
    /// ```
    /// let filter = FilterPage::default().field_path("/hello-world");
    /// # assert_eq!(filter.fields.path, Some("/hello-world".to_string()));
    /// ```
    pub fn field_path(mut self, path: impl Into<Option<String>>) -> Self {
        self.fields.path = path.into();
        self
    }

    /// Sets the content field.
    ///
    /// # Parameters
    ///
    /// - `content` - The content to filter by.
    ///
    /// # Returns
    ///
    /// The updated `FilterPage` object.
    ///
    /// # Examples
    ///
    /// ```
    /// let filter = FilterPage::default().field_content("Hello, world!");
    /// # assert_eq!(filter.fields.content, Some("Hello, world!".to_string()));
    /// ```
    pub fn field_content(mut self, content: impl Into<Option<String>>) -> Self {
        self.fields.content = content.into();
        self
    }
}

#[async_trait::async_trait]
impl super::Command for FilterPage {
    type Client = PageClient<Self::Backend>;
    type Backend = Arc<RwLock<Vec<Page>>>;
    type Output = Vec<Page>;

    async fn execute(self, backend: Self::Backend) -> super::Result<Self::Output> {
        backend.read().map_err(super::Error::from).map(|backend| {
            backend
                .iter()
                .filter(|&page| self.fields.id.is_none() || self.fields.id == Some(page.id))
                .filter(|&page| {
                    self.fields.path.is_none() || self.fields.path.as_ref() == Some(&page.path)
                })
                .filter(|&page| {
                    self.fields.title.is_none() || self.fields.title.as_ref() == Some(&page.title)
                })
                .filter(|&page| {
                    self.fields.content.is_none()
                        || self.fields.content.as_ref() == Some(&page.content)
                })
                .cloned()
                .collect()
        })
    }
}

#[derive(Clone)]
pub struct CreatePage {
    title: String,
    path: String,
    content: String,
}

#[async_trait::async_trait]
impl super::Command for CreatePage {
    type Client = PageClient<Self::Backend>;
    type Backend = Arc<RwLock<Vec<Page>>>;
    type Output = ();

    async fn execute(self, backend: Self::Backend) -> super::Result<Self::Output> {
        let mut backend = backend.write().map_err(super::Error::from)?;
        let id = backend.len() as u32 + 1;
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

#[derive(Clone)]
pub struct UpdatePage {
    filter: FilterPage,
    title: Option<String>,
    path: Option<String>,
    content: Option<String>,
}

#[async_trait::async_trait]
impl super::Command for UpdatePage {
    type Client = PageClient<Self::Backend>;
    type Backend = Arc<RwLock<Vec<Page>>>;
    type Output = ();

    async fn execute(self, backend: Self::Backend) -> super::Result<Self::Output> {
        let mut backend = backend.write().map_err(super::Error::from)?;
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
