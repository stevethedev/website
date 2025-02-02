use crate::client::account::crypto::verify_password;

mod crypto;
mod memory_db;
mod postgresql_db;

pub struct AccountClient<TBackend>
where
    TBackend: Send + Sync,
{
    backend: TBackend,
}

#[derive(Clone)]
pub struct Account {
    pub id: i32,
    pub username: String,
    pub display_name: String,
}

#[derive(Default)]
pub struct Login {
    pub username: String,
    pub password: String,
}

impl From<crate::schema::login::Login> for Login {
    fn from(value: crate::schema::login::Login) -> Self {
        Self {
            username: value.username,
            password: value.password,
        }
    }
}

struct PasswordedAccount {
    id: i32,
    username: String,
    password_hash: String,
    display_name: String,
}

impl PasswordedAccount {
    fn check_password(self, password: &str) -> Option<Account> {
        match verify_password(&self.password_hash, &password) {
            Ok(true) => Some(self.into()),
            _ => None,
        }
    }
}

impl Into<Account> for PasswordedAccount {
    fn into(self) -> Account {
        Account {
            id: self.id,
            username: self.username,
            display_name: self.display_name,
        }
    }
}
