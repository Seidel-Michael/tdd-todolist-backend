import {DatabasePoolType, sql} from 'slonik';

export class DbConnection
{
    private pool: DatabasePoolType;

    constructor(pool: DatabasePoolType)
    {
        this.pool = pool;
    }

    public async addTodo(title: string)
    {
        await this.pool.query(sql`INSERT INTO todolist.todos(title, state) VALUES (${title}, true)`);
    }

    public async removeTodo(id: string)
    {
        throw new Error('Not implemented!');
    }

    public async changeTodoState(id: string, state: boolean)
    {
        throw new Error('Not implemented!');
    }

    public async getTodos()
    {
        throw new Error('Not implemented!');
    }
}