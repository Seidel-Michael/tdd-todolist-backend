import { Server } from 'http';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import cors from '@koa/cors';

import { TodoRoutes } from './routes/todo-routes'
import { DbConnection } from '../db/db-connection';

export class Api {
    public app: Koa;

    constructor(connection: DbConnection) {
        this.app = new Koa();
        this.app.use(koaLogger());
        this.app.use(koaBodyParser());
        this.app.use(cors());

        const todoRoutes = new TodoRoutes(connection);

        this.app.use(todoRoutes.router.routes());
    }
}