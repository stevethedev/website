use crate::auth::{JwtData, JwtDurationSeconds, JwtManager};
use crate::client::account::{AccountClient, GetAccount, Login as LoginCommand};
use crate::client::Client;
use crate::schema::login::Login;
use crate::schema::login_response::LoginResponse;
use actix_web::web::{Data, Json};
use actix_web::{get, post};
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

#[post("/renew/")]
pub async fn renew(
    jwt_manager: Data<JwtManager>,
    token_duration_seconds: Data<JwtDurationSeconds>,
    jwt_data: JwtData,
) -> impl actix_web::Responder {
    let token_duration_seconds = *token_duration_seconds.into_inner();
    match jwt_manager
        .into_inner()
        .create_jwt(jwt_data, token_duration_seconds)
    {
        Ok((jwt, expires)) => {
            let expires =
                chrono::DateTime::from_timestamp(expires as i64, 0).map(|val| val.to_rfc3339());
            match expires {
                Some(expires) => actix_web::HttpResponse::Ok().json(LoginResponse { jwt, expires }),
                None => actix_web::HttpResponse::InternalServerError().finish(),
            }
        }
        Err(_) => actix_web::HttpResponse::InternalServerError().finish(),
    }
}

#[get("/whoami/")]
pub async fn whoami(jwt_data: JwtData, db_pool: Data<PgPool>) -> impl actix_web::Responder {
    let client = AccountClient::from(db_pool.into_inner());
    let command = GetAccount::by_id(jwt_data.user_id);

    let maybe_account = match client.send(command).await {
        Ok(maybe_account) => maybe_account,
        Err(err) => {
            log::error!("Error getting account: {}", err);
            return actix_web::HttpResponse::InternalServerError().finish();
        }
    };

    let attempted_account = match maybe_account.map(crate::schema::account::Account::try_from) {
        Some(account) => account,
        None => return actix_web::HttpResponse::NotFound().finish(),
    };

    match attempted_account {
        Ok(account) => actix_web::HttpResponse::Ok().json(account),
        Err(err) => {
            log::error!("Error converting account: {}", err);
            actix_web::HttpResponse::InternalServerError().finish()
        }
    }
}
