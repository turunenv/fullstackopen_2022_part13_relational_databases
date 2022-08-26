CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('Veku Turunen', 'webdev.com', 'SQL vs noSQL');
insert into blogs (author, url, title) values ('Brian Kernighan', 'c.com', 'c is fun');
