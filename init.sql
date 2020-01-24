CREATE DATABASE todolist;
\connect -reuse-previous=on "dbname='todolist'"
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE todos (
	id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
	title varchar(50) NOT NULL,
	state bool NOT NULL
);