import { DbConnection } from './db-connection';
import { expect } from 'chai';
import chai from 'chai'
import sinon from 'sinon';
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
import { normalizeQuery } from '../../test-helper/normalizeQuery';

import { DatabasePoolType, ConnectionError } from 'slonik';


describe('DbConnection', () => {
    let poolStub: any;
    let connection: DbConnection;
    beforeEach(() => {
        poolStub = <DatabasePoolType>{
        };
        poolStub.query = sinon.stub();
        poolStub.any = sinon.stub();

        connection = new DbConnection(poolStub);
    });

    describe('addTodo', () => {
        it('should reject with Error if database connection failed', async () => {
            poolStub.query.rejects(new ConnectionError('getaddrinfo ENOTFOUND postgresql postgresql:5432'));

            return expect(connection.addTodo('abcdefg')).to.be.rejectedWith('Connection to database failed.');
        });

        it('should reject with Error if insert into database failed', async () => {
            poolStub.query.rejects(new Error('error: relation "todos" does not exist'));

            return expect(connection.addTodo('abcdefg')).to.be.rejectedWith('Oops... something went wrong.');
        });

        it('should insert todo in database and resolve', async () => {
            await connection.addTodo('abcdefg');

            expect(poolStub.query.callCount).to.equal(1);
            expect(normalizeQuery(poolStub.query.firstCall.args[0].sql)).to.equal('INSERT INTO todolist.todos(title, state) VALUES ($1, true)');
            expect(poolStub.query.firstCall.args[0].values).to.deep.equal(['abcdefg']);
        });
    });

    describe('removeTodo', () => {
        it('should reject with Error if database connection failed', async () => {
            poolStub.query.rejects(new ConnectionError('getaddrinfo ENOTFOUND postgresql postgresql:5432'));

            return expect(connection.removeTodo('id')).to.be.rejectedWith('Connection to database failed.');
        });

        it('should reject with Error if delete from database failed', async () => {
            poolStub.query.rejects(new Error('error: relation "todos" does not exist'));

            return expect(connection.removeTodo('id')).to.be.rejectedWith('Oops... something went wrong.');
        });

        it('should remove todo from database and resolve', async () => {
            await connection.removeTodo('id');

            expect(poolStub.query.callCount).to.equal(1);
            expect(normalizeQuery(poolStub.query.firstCall.args[0].sql)).to.equal('DELETE FROM todolist.todos WHERE id=$1');
            expect(poolStub.query.firstCall.args[0].values).to.deep.equal(['{id}']);
        });


    });

    describe('changeTodoState', () => {
        it('should reject with Error if database connection failed', async () => {
            poolStub.query.rejects(new ConnectionError('getaddrinfo ENOTFOUND postgresql postgresql:5432'));

            return expect(connection.changeTodoState('id', false)).to.be.rejectedWith('Connection to database failed.');
        });

        it('should reject with Error if update database failed', async () => {
            poolStub.query.rejects(new Error('error: relation "todos" does not exist'));

            return expect(connection.changeTodoState('id', false)).to.be.rejectedWith('Oops... something went wrong.');
        });

        it('should update todo state in database and resolve', async () => {
            await connection.changeTodoState('id', false);

            expect(poolStub.query.callCount).to.equal(1);
            expect(normalizeQuery(poolStub.query.firstCall.args[0].sql)).to.equal('UPDATE todolist.todos SET state=$1 WHERE id=$2');
            expect(poolStub.query.firstCall.args[0].values).to.deep.equal([false, '{id}']);
        });
    });

    describe('getTodos', () => {

        it('should reject with Error if database connection failed', async () => {
            poolStub.any.rejects(new ConnectionError('getaddrinfo ENOTFOUND postgresql postgresql:5432'));

            return expect(connection.getTodos()).to.be.rejectedWith('Connection to database failed.');
        });

        it('should reject with Error if select from database failed', async () => {
            poolStub.any.rejects(new Error('error: relation "todos" does not exist'));

            return expect(connection.getTodos()).to.be.rejectedWith('Oops... something went wrong.');
        });

        it('should resolve with data from database', async () => {
            poolStub.any.resolves([
                {
                    id: '62c460f0-426f-4339-addb-5aab3a4bbc14',
                    title: 'Test 1',
                    state: true
                },
                {
                    id: '94a9e91a-a914-41e6-8f1c-9dcc16c71cac',
                    title: 'Test 2',
                    state: false
                },
                {
                    id: '75002238-941d-4738-8728-a81eae96cb4f',
                    title: 'Test 4',
                    state: true
                },
                {
                    id: '9cad782a-3e3c-4523-94ba-7b892379f6a9',
                    title: 'Test 5',
                    state: true
                }
            ]);

            const result = await connection.getTodos();

            expect(poolStub.any.callCount).to.equal(1);
            expect(normalizeQuery(poolStub.any.firstCall.args[0].sql)).to.equal('SELECT * FROM todolist.todos');

            expect(result).to.deep.equal([
                {
                    id: '62c460f0-426f-4339-addb-5aab3a4bbc14',
                    title: 'Test 1',
                    state: true
                },
                {
                    id: '94a9e91a-a914-41e6-8f1c-9dcc16c71cac',
                    title: 'Test 2',
                    state: false
                },
                {
                    id: '75002238-941d-4738-8728-a81eae96cb4f',
                    title: 'Test 4',
                    state: true
                },
                {
                    id: '9cad782a-3e3c-4523-94ba-7b892379f6a9',
                    title: 'Test 5',
                    state: true
                }
            ]);
        });
    });
});