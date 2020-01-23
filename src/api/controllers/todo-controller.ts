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
        try {
            await TodoController.connection.removeTodo(ctx.params.id);
            ctx.status = 204;
        } catch (error) {
            ctx.body = error.message;
            ctx.status = 500;
        }
    }

    static async changeTodoState(ctx: ParameterizedContext) {
        if (ctx.request.body.state === undefined) {
            ctx.status = 400;
            return
        }

        if (typeof ctx.request.body.state !== 'boolean') {
            ctx.status = 400;
            return
        }

        try {
            await TodoController.connection.changeTodoState(ctx.params.id, ctx.request.body.state);
            ctx.status = 204;
        } catch (error) {
            ctx.body = error.message;
            ctx.status = 500;
        }
    }

    static async getTodos(ctx: ParameterizedContext) {
        try {
            const result = await TodoController.connection.getTodos();
            ctx.set('Content-Type', 'application/json');
            ctx.body = JSON.stringify(result);
            ctx.status = 200;
        } catch (error) {
            ctx.body = error.message;
            ctx.status = 500;
        }
    }
}