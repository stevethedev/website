use crate::auth::{JwtData, JwtDurationSeconds, JwtManager};
use crate::client::account::{AccountClient, Login as LoginCommand};
use crate::client::Client;
use crate::schema::login::Login;
use crate::schema::login_response::LoginResponse;
use actix_web::post;
use actix_web::web::{Data, Json};
use sqlx::PgPool;

#[post("/")]
pub async fn login(
    jwt_manager: Data<JwtManager>,
    db_pool: Data<PgPool>,
    token_duration_seconds: Data<JwtDurationSeconds>,
    login: Result<Json<Login>, actix_web::Error>,
) -> impl actix_web::Responder {
    let login = match login {
        Ok(login) => login,
        Err(err) => return actix_web::HttpResponse::BadRequest().body(err.to_string()),
    };
    let token_duration_seconds = *token_duration_seconds.into_inner();
    let client = AccountClient::from(db_pool.into_inner());
    let login_command_output = client.send(LoginCommand::from(login.into_inner())).await;

    match login_command_output {
        Ok(Some(account)) => {
            let jwt_data = JwtData {
                user_id: account.id,
                grants: vec![],
            };
            match jwt_manager
                .into_inner()
                .create_jwt(jwt_data, token_duration_seconds)
            {
                Ok((jwt, expires)) => {
                    let expires = chrono::DateTime::from_timestamp(expires as i64, 0)
                        .map(|val| val.to_rfc3339());
                    match expires {
                        Some(expires) => {
                            actix_web::HttpResponse::Ok().json(LoginResponse { jwt, expires })
                        }
                        None => actix_web::HttpResponse::InternalServerError().finish(),
                    }
                }
                Err(_) => actix_web::HttpResponse::InternalServerError().finish(),
            }
        }
        Ok(None) => actix_web::HttpResponse::Unauthorized().finish(),
        Err(_) => actix_web::HttpResponse::InternalServerError().finish(),
    }
}
