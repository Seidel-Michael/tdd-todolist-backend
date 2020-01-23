import { DbConnection } from './db/db-connection';
import { createPool, sql } from 'slonik';

const pool = createPool('postgresql://postgres:mysecretpassword@localhost:5432/todolist');
const connection = new DbConnection(pool);
//connection.addTodo('Ich bin ein Test');

//connection.removeTodo('{76fe2d60-bb19-45d8-a96b-6fa94ba70bbd}');

connection.getTodos().then((result) => console.log(result));