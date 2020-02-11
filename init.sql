CREATE DATABASE todolist;
\connect -reuse-previous=on "dbname='todolist'"
CREATE TABLE todos (
	id SERIAL NOT NULL PRIMARY KEY,
	title varchar(50) NOT NULL,
	state bool NOT NULL
);