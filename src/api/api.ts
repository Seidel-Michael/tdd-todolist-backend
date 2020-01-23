import { Server } from 'http';
import * as Koa from 'koa';
import * as koaBodyParser from 'koa-bodyparser';
import * as koaLogger from 'koa-logger';

import {TodoRoutes} from './routes/todo-routes'
import { DbConnection } from '../db/db-connection';

export class Api {
    public app: Koa;

    constructor(connection: DbConnection)
    {
        throw Error('Not implemented!')
    }
}