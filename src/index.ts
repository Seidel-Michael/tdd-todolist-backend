import {DbConnection} from './db/db-connection';
import {createPool} from 'slonik';

const connection = new DbConnection(createPool('postgresql://postgres:mysecretpassword@localhost:5432/todolist'));
connection.addTodo('Ich bin ein Test');

connection.removeTodo('{76fe2d60-bb19-45d8-a96b-6fa94ba70bbd}');