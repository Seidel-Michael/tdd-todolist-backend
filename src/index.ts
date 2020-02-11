import { createPool } from 'slonik';
import { Api } from './api/api';
import { DbConnection } from './db/db-connection';

const pool = createPool('postgresql://postgres:mysecretpassword@localhost:5432/todolist');
const connection = new DbConnection(pool);

const api = new Api(connection);
const port = process.env.port || 8080;

api.app
  .listen(port)
  .on('error', err => {
    // tslint:disable-next-line:no-console
    console.error(err);
  })
  .on('listening', () => {
    // tslint:disable-next-line:no-console
    console.log(`Server listening on port ${port}`);
  });
