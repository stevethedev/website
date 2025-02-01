//! This module defines the core traits and implementations for a command pattern in Rust.
//! It includes the `Command` trait for defining commands with associated input and output types,
//! and the `Client` trait for dispatching these commands to a backend.

pub mod page;

/// A type alias for a `Result` with a boxed dynamic error.
pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    GenericError(String),
}

impl std::error::Error for Error {}
impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                Self::GenericError(message) => format!("GenericError: {}", message),
            }
        )
    }
}

impl<T> From<std::sync::PoisonError<T>> for Error {
    fn from(value: std::sync::PoisonError<T>) -> Self {
        Self::GenericError(value.to_string())
    }
}

/// The `Command` trait represents an asynchronous command that can be executed with a given backend.
///
/// # Associated Types
/// - `Backend`: The type of the backend that the command operates on.
/// - `Output`: The type of the result produced by the command.
///
/// # Example
/// ```
/// struct MyCommand;
///
/// #[async_trait::async_trait]
/// impl Command for MyCommand {
///     type Backend = MyBackend;
///     type Output = MyOutput;
///
///     async fn execute(&self, backend: Self::Backend) -> Result<Self::Output> {
///         // Command execution logic
///     }
/// }
/// ```
#[async_trait::async_trait]
pub trait Command<TBackend: Send + Sync>: Send + Sync {
    type Client: Client<TBackend>;
    type Output;

    async fn execute(self, backend: TBackend) -> Result<Self::Output>;
}

/// The `Client` trait represents a client that can dispatch commands to a backend.
///
/// # Associated Types
/// - `TBackend`: The type of the backend that the client operates on.
///
/// # Example
/// ```
/// struct MyClient {
///     backend: MyBackend,
/// }
///
/// #[async_trait::async_trait]
/// impl Client<MyBackend> for MyClient {
///     fn backend(&self) -> MyBackend {
///         self.backend.clone()
///     }
/// }
/// ```
#[async_trait::async_trait]
pub trait Client<TBackend: Send + Sync>: Send + Sync {
    fn backend(&self) -> TBackend;

    async fn send<TCommand: Command<TBackend, Client = Self>>(
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

    /// Tests the `FilterPage` command with a memory backend.
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
        impl Command<Arc<RwLock<Vec<Record>>>> for FilterPage {
            type Client = MemoryClient;
            type Output = Vec<Record>;

            async fn execute(self, backend: Arc<RwLock<Vec<Record>>>) -> Result<Self::Output> {
                let backend = backend.read()?;
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

    /// Tests the `FilterPage` command with a different backend type.
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
        impl Command<()> for FilterPage {
            type Client = MemoryClient;
            type Output = String;

            async fn execute(self, _: ()) -> Result<Self::Output> {
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
