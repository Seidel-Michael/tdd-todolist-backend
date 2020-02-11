import cors from '@koa/cors';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import koaLogger from 'koa-logger';
import { DbConnection } from '../db/db-connection';
import { TodoRoutes } from './routes/todo-routes';

export class Api {
  app: Koa;

  constructor(connection: DbConnection) {
    this.app = new Koa();
    this.app.use(koaLogger());
    this.app.use(koaBodyParser());
    this.app.use(cors());

    const todoRoutes = new TodoRoutes(connection);

    this.app.use(todoRoutes.router.routes());
  }
}
