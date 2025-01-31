use crate::client::page::Page;
use actix_web::{
    middleware::Logger,
    web::{scope, Data},
    App, HttpServer,
};
use std::sync::RwLock;

mod client;
mod route;
mod schema;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    let pages_db = Data::new(RwLock::new(vec![Page {
        id: 1,
        title: "Hello, world!".to_string(),
        path: "/".to_string(),
        content: "Hello, body!".to_string(),
    }]));
    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(pages_db.clone())
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
