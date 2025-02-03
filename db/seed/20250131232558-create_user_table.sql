CREATE TABLE IF NOT EXISTS account
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR   NOT NULL,
    password_hash VARCHAR   NOT NULL,
    display_name  VARCHAR   NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO account (username, password_hash, display_name)
VALUES ('admin', '$argon2id$v=19$m=16,t=2,p=1$QXZnak1yTXpFY2NDeDVhMQ$xfg86Hl/EZ1efP3nGG3NPg', 'Administrator');
