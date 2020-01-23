import { DbConnection } from './db/db-connection';
import { createPool } from 'slonik';
import { Api } from './api/api';

/*const pool = createPool('postgresql://postgres:mysecretpassword@localhost:5432/todolist');
const connection = new DbConnection(pool);

const api = new Api(connection);

const PORT = 8080;

api.app.listen(PORT)
    .on('error', err => {
        console.error(err);
    })
    .on('listening', () => {
        console.log(`Server listening on port ${PORT}`);
    });*/