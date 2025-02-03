use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};

#[derive(Debug)]
pub enum Error {
    Argon2Error(argon2::Error),
    HashError(argon2::password_hash::Error),
}

impl From<argon2::Error> for Error {
    fn from(err: argon2::Error) -> Self {
        Error::Argon2Error(err)
    }
}

impl From<argon2::password_hash::Error> for Error {
    fn from(err: argon2::password_hash::Error) -> Self {
        Error::HashError(err)
    }
}

impl std::error::Error for Error {}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Error::Argon2Error(err) => write!(f, "Argon2 error: {}", err),
            Error::HashError(err) => write!(f, "Hash error: {}", err),
        }
    }
}

fn generate_salt() -> SaltString {
    SaltString::generate(&mut OsRng)
}

fn hash_password_internal(password: &str, salt: SaltString) -> Result<String, Error> {
    let argon2 = Argon2::default();
    let password_hash = argon2.hash_password(password.as_bytes(), salt.as_salt())?;
    Ok(password_hash.to_string())
}

pub fn hash_password(password: &str) -> Result<String, Error> {
    hash_password_internal(password, generate_salt())
}

pub fn verify_password(stored_hash: &str, password: &str) -> Result<bool, Error> {
    let parsed_hash = PasswordHash::new(stored_hash)?;
    Ok(Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hash_password() {
        let password = "password";
        let salt = generate_salt();
        let hash = hash_password_internal(password, salt.clone()).unwrap();
        assert_eq!(verify_password(&hash, password).unwrap(), true);
    }

    #[test]
    fn test_verify_password() {
        let salt = generate_salt();
        let hash = hash_password_internal("password", salt.clone()).unwrap();
        assert_eq!(verify_password(&hash, "password2").unwrap(), false);
    }
}
