CREATE TABLE IF NOT EXISTS page
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    path       VARCHAR(255) NOT NULL,
    content    TEXT         NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO page (title, path, content)
VALUES ('Home', '/', '# Hello World!' + CHAR(10) + 'This is a sample body that was written in markdown.');
