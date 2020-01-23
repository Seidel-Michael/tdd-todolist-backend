import { Api } from './../api';
import { expect } from 'chai';
import chai from 'chai'
import sinon from 'sinon';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

import { DbConnection } from './../../db/db-connection';
import { Server } from 'http';


describe.only('/api/v1', () => {
    let baseUrl = '/api/v1';
    let api: Api;
    let server: Server;
    let connectionStub: sinon.SinonStubbedInstance<DbConnection>;
    beforeEach((done) => {
        connectionStub = sinon.createStubInstance(DbConnection);
        api = new Api(connectionStub as unknown as DbConnection);
        server = api.app.listen().on('listening', done);
    });

    afterEach(() => {
        server.close();
    });

    describe('POST /todos', () => {
        it('should return error message with status 500 if addTodo rejects with an error', async () => {
            connectionStub.addTodo.rejects(new Error('Some error.'));

            const result = await chai.request(server).post(`${baseUrl}/todos`).send({ title: 'test' });

            expect(connectionStub.addTodo.callCount).to.equal(1);
            expect(result).to.have.status(500);
            expect(result.text).to.equal('Some error.');
        });

        it('should return status 400 if request body does not contain valid json with title', async () => {
            const result = await chai.request(server).post(`${baseUrl}/todos`).send({ abc: 'test' });

            expect(connectionStub.addTodo.callCount).to.equal(0);
            expect(result).to.have.status(400);
        });

        it('should return status 400 if title in reuqets body is not a string', async () => {
            const result = await chai.request(server).post(`${baseUrl}/todos`).send({ title: 123 });

            expect(connectionStub.addTodo.callCount).to.equal(0);
            expect(result).to.have.status(400);
        });

        it('should add todo and return no body with staus 204', async () => {
            const result = await chai.request(server).post(`${baseUrl}/todos`).send({ title: 'abcdefg' });

            expect(connectionStub.addTodo.callCount).to.equal(1);
            expect(connectionStub.addTodo.firstCall.args[0]).to.equal('abcdefg');
            expect(result).to.have.status(204);
        })
    });

    describe('DELETE /todos/:id', () => {

    });

    describe('PUT /todos/:id', () => {

    });

    describe('GET /todos', () => {

    });
});