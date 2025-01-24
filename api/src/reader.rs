use actix_web::{get, App, HttpResponse, HttpServer, Responder};

mod schema;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json(schema::hello_world::HelloWorld {
        message: "Hello, reader!".to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(hello))
        .bind(("0.0.0.0", 8000))?
        .run()
        .await
}
