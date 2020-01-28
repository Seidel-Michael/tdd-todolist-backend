import { DatabasePoolType, sql, ConnectionError } from 'slonik';
import { TodoItem } from '../models/todo-item';

export class DbConnection {
    private pool: DatabasePoolType;

    constructor(pool: DatabasePoolType) {
        this.pool = pool;
    }

    public async addTodo(title: string) {
        try {
            await this.pool.query(sql`INSERT INTO todos(title, state) VALUES (${title}, true)`);
        } catch (error) {
            if (error instanceof ConnectionError) {
                throw new Error('Connection to database failed.');
            }

            throw new Error('Oops... something went wrong.');
        }
    }

    public async removeTodo(id: string) {
        try {
            await this.pool.query(sql`DELETE FROM todos WHERE id=${`${id}`}`);
        } catch (error) {
            if (error instanceof ConnectionError) {
                throw new Error('Connection to database failed.');
            }

            throw new Error('Oops... something went wrong.');
        }
    }

    public async changeTodoState(id: string, state: boolean) {
        try {
            await this.pool.query(sql`UPDATE todos SET state=${state} WHERE id=${`${id}`}`);
        } catch (error) {
            if (error instanceof ConnectionError) {
                throw new Error('Connection to database failed.');
            }

            throw new Error('Oops... something went wrong.');
        }
    }

    public async getTodos(): Promise<TodoItem[]> {
        let result;
        try {
            result = await this.pool.any<TodoItem>(sql`SELECT * FROM todos ORDER BY id`);
        } catch (error) {
            if (error instanceof ConnectionError) {
                throw new Error('Connection to database failed.');
            }

            throw new Error('Oops... something went wrong.');
        }

        return result;
    }
}