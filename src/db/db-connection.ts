import { DatabasePoolType, sql, ConnectionError, NotFoundError } from 'slonik';

export class DbConnection {
    private pool: DatabasePoolType;

    constructor(pool: DatabasePoolType) {
        this.pool = pool;
    }

    public async addTodo(title: string) {
        try {
            await this.pool.query(sql`INSERT INTO todolist.todos(title, state) VALUES (${title}, true)`);
        } catch (error) {
            if (error instanceof ConnectionError) {
                throw new Error('Connection to database failed.');
            }

            throw new Error('Oops... something went wrong.');
        }
    }

    public async removeTodo(id: string) {
        try {
            await this.pool.query(sql`DELETE FROM todolist.todos WHERE id=${`{${id}}`}`);
        } catch (error) {
            if (error instanceof ConnectionError) {
                throw new Error('Connection to database failed.');
            } 
            
            throw new Error('Oops... something went wrong.');
        }
    }

    public async changeTodoState(id: string, state: boolean) {
        throw new Error('Not implemented!');
    }

    public async getTodos() {
        throw new Error('Not implemented!');
    }
}