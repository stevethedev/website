use crate::auth::jwt_data::JwtData;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    data: JwtData,
    exp: u64,
}

#[derive(Copy, Clone)]
pub struct JwtDurationSeconds(pub u64);

impl From<u64> for JwtDurationSeconds {
    fn from(value: u64) -> Self {
        Self(value)
    }
}

impl Into<u64> for JwtDurationSeconds {
    fn into(self) -> u64 {
        self.0
    }
}

pub struct JwtManager {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
}

impl JwtManager {
    pub fn new(secret: &[u8]) -> Self {
        let encoding_key = EncodingKey::from_secret(secret);
        let decoding_key = DecodingKey::from_secret(secret);
        Self {
            encoding_key,
            decoding_key,
        }
    }

    pub fn create_jwt(
        &self,
        data: JwtData,
        duration_seconds: JwtDurationSeconds,
    ) -> Result<(String, u64), Box<dyn std::error::Error>> {
        let exp = duration_seconds.0 + now()?;
        let my_claims = Claims { data, exp };

        let token = encode(&Header::default(), &my_claims, &self.encoding_key).unwrap();
        Ok((token, exp))
    }

    pub fn decode_jwt(&self, token: &str) -> Result<Option<JwtData>, Box<dyn std::error::Error>> {
        let validation = Validation::default();

        let Claims { data, exp } = decode::<Claims>(token, &self.decoding_key, &validation)?.claims;

        if exp < now()? {
            Ok(None)
        } else {
            Ok(Some(data))
        }
    }
}

fn now() -> Result<u64, Box<dyn std::error::Error>> {
    Ok(SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())?)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_jwt() {
        let data = JwtData {
            user_id: 1,
            grants: vec!["read".to_string(), "write".to_string()],
        };

        let jwt_manager = crate::auth::JwtManager::new(b"secret");
        let (token, _exp) = jwt_manager
            .create_jwt(data.clone(), 3600.into())
            .expect("Failed to create JWT");
        assert!(!token.is_empty());

        let decoded = jwt_manager
            .decode_jwt(&token)
            .expect("Failed to decode JWT");

        assert_eq!(decoded, Some(data));
    }
}
