import {DbConnection} from './db/db-connection';
import {createPool} from 'slonik';

let connection = new DbConnection(createPool('postgresql://postgres:mysecretpassword@localhost:5432/todolist'));
connection.addTodo('Ich bin ein Test');