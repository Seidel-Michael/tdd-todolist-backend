import { DbConnection } from "../../db/db-connection";
import { ParameterizedContext } from "koa";

export class TodoController
{
    constructor(connection: DbConnection)
    {
        throw Error('Not implemented!')
    }

    async addTodo(ctx: ParameterizedContext)
    {
        throw Error('Not implemented!')
    }

    async removeTodo(ctx: ParameterizedContext)
    {
        throw Error('Not implemented!')
    }

    async changeTodoState(ctx: ParameterizedContext)
    {
        throw Error('Not implemented!')
    }

    async getTodos(ctx: ParameterizedContext)
    {
        throw Error('Not implemented!')
    }
}