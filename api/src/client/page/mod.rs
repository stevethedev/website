mod memory_db;
mod postgresql_db;

pub struct PageClient<TBackend>
where
    TBackend: Send + Sync,
{
    backend: TBackend,
}

#[derive(Clone)]
pub struct Page {
    pub id: i32,
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
    pub id: Option<i32>,
    pub path: Option<String>,
}

#[derive(Clone, Default)]
pub struct Pagination {
    pub limit: Option<u64>,
    pub offset: Option<u64>,
}

#[derive(Clone, Default)]
pub struct FilterPage {
    pub fields: Fields,
    pub pagination: Option<Pagination>,
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
    pub fn field_id(mut self, id: impl Into<Option<i32>>) -> Self {
        self.fields.id = id.into();
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

    /// Sets the limit field.
    ///
    /// # Parameters
    ///
    /// - `limit` - The maximum number of results to return.
    ///
    /// # Returns
    ///
    /// The updated `FilterPage` object.
    ///
    /// # Examples
    ///
    /// ```
    /// let filter = FilterPage::default().limit(10);
    /// # assert_eq!(filter.pagination.map(|p| p.limit), Some(10));
    /// ```
    pub fn limit(mut self, limit: impl Into<Option<u64>>) -> Self {
        let limit = limit.into();
        self.pagination = Some(Pagination {
            limit,
            offset: self.pagination.map(|p| p.offset).unwrap_or_default(),
        });
        self
    }

    /// Sets the offset field.
    ///
    /// # Parameters
    ///
    /// - `offset` - The number of results to skip.
    ///
    /// # Returns
    ///
    /// The updated `FilterPage` object.
    ///
    /// # Examples
    ///
    /// ```
    /// let filter = FilterPage::default().offset(10);
    /// # assert_eq!(filter.pagination.map(|p| p.offset), Some(10));
    /// ```
    pub fn offset(mut self, offset: impl Into<Option<u64>>) -> Self {
        let offset = offset.into();
        self.pagination = Some(Pagination {
            limit: self.pagination.map(|p| p.limit).unwrap_or_default(),
            offset,
        });
        self
    }
}

#[derive(Clone)]
pub struct CreatePage {
    title: String,
    path: String,
    content: String,
}

#[derive(Clone)]
pub struct UpdatePage {
    filter: FilterPage,
    title: Option<String>,
    path: Option<String>,
    content: Option<String>,
}
