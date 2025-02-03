use crate::auth::JwtManager;
use actix_web::http::header::AUTHORIZATION;
use actix_web::web::Data;
use actix_web::{Error, FromRequest, HttpMessage, HttpRequest};
use serde::{Deserialize, Serialize};
use std::future::{ready, Ready};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct JwtData {
    pub user_id: i32,
    pub grants: Vec<String>,
}

fn read_bearer_token(req: &HttpRequest) -> Option<&str> {
    req.headers()
        .get(AUTHORIZATION)
        .and_then(|val| match val.to_str() {
            Ok(val) => Some(val),
            Err(err) => {
                log::error!("Error reading Authorization header: {}", err);
                None
            }
        })
        .map(|auth_header| {
            const PREFIX: &str = "Bearer ";
            if auth_header.starts_with(PREFIX) {
                &auth_header[PREFIX.len()..]
            } else {
                ""
            }
        })
}

fn parse_bearer_token(jwt_manager: &JwtManager, bearer_token: &str) -> Option<JwtData> {
    match jwt_manager.decode_jwt(bearer_token) {
        Ok(Some(jwt_data)) => Some(jwt_data),
        Ok(None) => {
            log::debug!("Token is expired");
            None
        }
        Err(err) => {
            log::error!("Error decoding token: {}", err);
            None
        }
    }
}

impl FromRequest for JwtData {
    type Error = Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _payload: &mut actix_web::dev::Payload) -> Self::Future {
        let jwt_manager = match req.app_data::<Data<JwtManager>>() {
            Some(jwt_manager) => jwt_manager.clone().into_inner(),
            None => {
                log::debug!("JwtManager is not available");
                return ready(Err(actix_web::error::ErrorInternalServerError(
                    "Internal Server Error",
                )));
            }
        };

        if let Some(jwt_data) = read_bearer_token(req)
            .and_then(|bearer_token| parse_bearer_token(&jwt_manager, bearer_token))
        {
            req.extensions_mut().insert(jwt_data);
        }

        if let Some(jwt_data) = req.extensions().get::<JwtData>() {
            ready(Ok(jwt_data.clone()))
        } else {
            ready(Err(actix_web::error::ErrorUnauthorized("Unauthorized")))
        }
    }
}
