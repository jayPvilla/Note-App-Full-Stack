CREATE TABLE IF NOT EXISTS tbl_users (
    id       INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_notes (
    id      INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content TEXT,
    title   TEXT,
    color   TEXT,
    date    DATE,
    status  TEXT DEFAULT 'pending',
    user_id INT REFERENCES tbl_users(id)
);