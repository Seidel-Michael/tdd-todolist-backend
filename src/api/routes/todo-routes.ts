import * as Router from 'koa-router';
import { DbConnection } from '../../db/db-connection';

export class TodoRoutes
{
    public router: Router;

    constructor(connection: DbConnection)
    {
        throw Error('Not implemented!')
    }
}