use actix_web::{
    middleware::Logger,
    web::{scope, Data},
    App, HttpServer,
};

mod auth;
mod client;
mod route;
mod schema;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db_pool = Data::new(
        sqlx::PgPool::connect(&database_url)
            .await
            .expect("Failed to connect to database"),
    );

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(db_pool.clone())
            .service(
                scope("/pages")
                    .service(route::page::list_pages)
                    .service(route::page::get_page),
            )
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}
