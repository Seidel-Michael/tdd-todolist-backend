import Router from 'koa-router';
import { DbConnection } from '../../db/db-connection';
import { TodoController } from '../controllers/todo-controller';

const BASE_URL = '/api/v1/todos';

export class TodoRoutes
{
    public router: Router;

    constructor(connection: DbConnection)
    {
        this.router = new Router();

        TodoController.connection = connection;

        this.router.post(`${BASE_URL}`, TodoController.addTodo);
    }
}