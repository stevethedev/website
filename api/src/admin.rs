use crate::auth::JwtDurationSeconds;
use actix_web::web::{scope, Data};
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

mod auth;
mod client;
mod route;
mod schema;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json(schema::hello_world::HelloWorld {
        message: "Hello, admin!".to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db_pool = Data::new(
        sqlx::PgPool::connect(&database_url)
            .await
            .expect("Failed to connect to database"),
    );
    let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let jwt_manager = Data::new(auth::JwtManager::new(jwt_secret.as_bytes()));
    let token_duration_seconds = Data::new(JwtDurationSeconds(60 * 60));

    HttpServer::new(move || {
        App::new()
            .app_data(db_pool.clone())
            .app_data(jwt_manager.clone())
            .app_data(token_duration_seconds.clone())
            .service(scope("/login").service(route::login::login))
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}
