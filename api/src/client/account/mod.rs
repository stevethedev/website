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

impl TryFrom<crate::schema::account::Account> for Account {
    type Error = <i32 as TryFrom<i64>>::Error;

    fn try_from(value: crate::schema::account::Account) -> Result<Self, Self::Error> {
        let id = i32::try_from(value.id)?;
        Ok(Self {
            id,
            username: value.username,
            display_name: value.display_name,
        })
    }
}

impl Into<crate::schema::account::Account> for Account {
    fn into(self) -> crate::schema::account::Account {
        crate::schema::account::Account {
            id: i64::from(self.id),
            username: self.username,
            display_name: self.display_name,
        }
    }
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

pub struct GetAccount {
    pub id: i32,
}

impl GetAccount {
    pub fn by_id(id: i32) -> Self {
        Self { id }
    }
}
