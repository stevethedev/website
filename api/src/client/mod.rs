pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[async_trait::async_trait]
pub trait Command: Send + Sync {
    type Backend: Send + Sync;
    type Output;

    async fn execute(&self, backend: Self::Backend) -> Result<Self::Output>;
}

#[async_trait::async_trait]
pub trait Client<TBackend: Send + Sync>: Send + Sync {
    fn backend(&self) -> TBackend;

    async fn send<TCommand: Command<Backend = TBackend>>(
        &self,
        command: TCommand,
    ) -> Result<TCommand::Output> {
        command.execute(self.backend()).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::{Arc, RwLock};

    #[tokio::test]
    async fn test_filter_page() {
        #[derive(Clone, PartialEq)]
        struct Record {
            id: String,
            title: String,
            body: String,
        }

        #[derive(Default)]
        struct MemoryClient {
            backend: Arc<RwLock<Vec<Record>>>,
        }

        #[async_trait::async_trait]
        impl Client<Arc<RwLock<Vec<Record>>>> for MemoryClient {
            fn backend(&self) -> Arc<RwLock<Vec<Record>>> {
                self.backend.clone()
            }
        }

        struct FilterPage {
            id: Option<String>,
            title: Option<String>,
            body: Option<String>,
        }

        #[async_trait::async_trait]
        impl Command for FilterPage {
            type Backend = Arc<RwLock<Vec<Record>>>;
            type Output = Vec<Record>;

            async fn execute(&self, backend: Self::Backend) -> Result<Self::Output> {
                let backend = backend.read().unwrap();
                let pages: Vec<Record> = backend
                    .iter()
                    .filter(|record| {
                        self.id.as_ref().map_or(true, |id| id == &record.id)
                            && self
                                .title
                                .as_ref()
                                .map_or(true, |title| title == &record.title)
                            && self.body.as_ref().map_or(true, |body| body == &record.body)
                    })
                    .cloned()
                    .collect();

                Ok(pages)
            }
        }

        let client = MemoryClient::default();
        {
            let mut backend = client.backend.write().unwrap();
            backend.append(&mut vec![
                Record {
                    id: "1".to_string(),
                    title: "Title 1".to_string(),
                    body: "Body 1".to_string(),
                },
                Record {
                    id: "2".to_string(),
                    title: "Title 2".to_string(),
                    body: "Body 2".to_string(),
                },
                Record {
                    id: "3".to_string(),
                    title: "Title 3".to_string(),
                    body: "Body 3".to_string(),
                },
            ]);
        }

        let command = FilterPage {
            id: Some("1".to_string()),
            title: None,
            body: None,
        };

        let pages = client.send(command).await.unwrap();

        assert_eq!(pages.len(), 1);
        assert_eq!(pages[0].id, "1");
        assert_eq!(pages[0].title, "Title 1");
        assert_eq!(pages[0].body, "Body 1");
    }

    #[tokio::test]
    async fn test_other_backend() {
        #[derive(Default)]
        struct MemoryClient;

        #[async_trait::async_trait]
        impl Client<()> for MemoryClient {
            fn backend(&self) -> () {
                ()
            }
        }

        struct FilterPage {
            id: Option<String>,
            title: Option<String>,
            body: Option<String>,
        }

        #[async_trait::async_trait]
        impl Command for FilterPage {
            type Backend = ();
            type Output = String;

            async fn execute(&self, _: Self::Backend) -> Result<Self::Output> {
                let mut writer = vec![];

                if let Some(id) = &self.id {
                    writer.push(format!("id = {id}"))
                }

                if let Some(title) = &self.title {
                    writer.push(format!("title = {title}"))
                }

                if let Some(body) = &self.body {
                    writer.push(format!("body = {body}"))
                }

                Ok(writer.join(" AND "))
            }
        }

        let client = MemoryClient::default();

        let command = FilterPage {
            id: Some("1".to_string()),
            title: None,
            body: None,
        };

        let query = client.send(command).await.unwrap();

        assert_eq!(&query, "id = 1");
    }
}
