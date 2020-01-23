import { DbConnection } from './db-connection';
import { expect } from 'chai';
import * as chai from 'chai'
import * as sinon from 'sinon';
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
import { normalizeQuery } from '../../test-helper/normalizeQuery';

import { DatabasePoolType, ConnectionError, NotFoundError } from 'slonik';


describe('DbConnection', () => {
    let poolStub: any;
    let connection: DbConnection;
    beforeEach(() => {
        poolStub = <DatabasePoolType>{
        };
        poolStub.query = sinon.stub();

        connection = new DbConnection(poolStub);
    });

    describe('addTodo', () => {
        it('should reject with Error if database connection failed', async () => {
            poolStub.query.rejects(new ConnectionError('getaddrinfo ENOTFOUND postgresql postgresql:5432'));

            return expect(connection.addTodo('abcdefg')).to.be.rejectedWith('Connection to database failed.');
        });

        it('should reject with Error if insert into database failed', () => {
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

        it('should reject with Error if delete from database failed', () => {
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

        it('should reject with Error if update database failed', () => {
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
});