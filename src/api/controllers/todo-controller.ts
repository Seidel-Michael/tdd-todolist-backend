import { DbConnection } from "../../db/db-connection";
import { ParameterizedContext } from "koa";

export class TodoController {
    static connection: DbConnection;

    static async addTodo(ctx: ParameterizedContext) {
        if (ctx.request.body.title === undefined) {
            ctx.status = 400;
            return
        }

        if (typeof ctx.request.body.title !== 'string') {
            ctx.status = 400;
            return
        }

        try {
            await TodoController.connection.addTodo(ctx.request.body.title);
            ctx.status = 204;
        } catch (error) {
            ctx.body = error.message;
            ctx.status = 500;
        }
    }

    static async removeTodo(ctx: ParameterizedContext) {
        throw Error('Not implemented!')
    }

    static async changeTodoState(ctx: ParameterizedContext) {
        throw Error('Not implemented!')
    }

    static async getTodos(ctx: ParameterizedContext) {
        throw Error('Not implemented!')
    }
}