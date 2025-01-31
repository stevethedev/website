use crate::{
    client::{
        page::{FilterPage, Page, PageClient},
        Client,
    },
    schema::page::Page as PageJson,
};
use actix_web::{
    get,
    web::{Data, Path, Query},
    HttpResponse, Responder,
};
use std::sync::RwLock;

#[derive(serde::Deserialize)]
struct FilterQuery {
    path: Option<String>,
}

#[get("/")]
async fn list_pages(
    pages_db: Data<RwLock<Vec<Page>>>,
    filter_query: Query<FilterQuery>,
) -> impl Responder {
    let filter_query = filter_query.into_inner();
    let client = PageClient::from(pages_db.into_inner());
    let command = FilterPage::default().field_path(filter_query.path);
    match client.send(command).await {
        Ok(pages) => HttpResponse::Ok().json(
            pages
                .into_iter()
                .map(Into::<PageJson>::into)
                .collect::<Vec<_>>(),
        ),
        Err(e) => HttpResponse::InternalServerError().json(e.to_string()),
    }
}

#[get("/{id}/")]
async fn get_page(pages_db: Data<RwLock<Vec<Page>>>, id: Path<u32>) -> impl Responder {
    let id = id.into_inner();
    let client = PageClient::from(pages_db.into_inner());
    let command = FilterPage {
        fields: crate::client::page::Fields {
            id: Some(id),
            path: None,
            content: None,
            title: None,
        },
    };
    match client.send(command).await {
        Ok(pages) => match pages.into_iter().next() {
            Some(page) => HttpResponse::Ok().json(Into::<PageJson>::into(page)),
            None => HttpResponse::NotFound().finish(),
        },
        Err(e) => HttpResponse::InternalServerError().json(e.to_string()),
    }
}
