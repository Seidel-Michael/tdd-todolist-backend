import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import sinon from 'sinon';
import { DbConnection } from './../../db/db-connection';
import { Api } from './../api';

chai.use(chaiHttp);

describe('/api/v1', () => {
  const baseUrl = '/api/v1';
  let api: Api;
  let server: Server;
  let connectionStub: sinon.SinonStubbedInstance<DbConnection>;
  beforeEach(done => {
    connectionStub = sinon.createStubInstance(DbConnection);
    api = new Api((connectionStub as unknown) as DbConnection);
    server = api.app.listen().on('listening', done);
  });

  afterEach(() => {
    server.close();
  });

  describe('POST /todos', () => {
    it('should return error message with status 500 if addTodo rejects with an error', async () => {
      connectionStub.addTodo.rejects(new Error('Some error.'));

      const result = await chai
        .request(server)
        .post(`${baseUrl}/todos`)
        .send({ title: 'test' });

      expect(connectionStub.addTodo.callCount).to.equal(1);
      expect(result).to.have.status(500);
      expect(result.text).to.equal('Some error.');
    });

    it('should return status 400 if request body does not contain valid json with title', async () => {
      const result = await chai
        .request(server)
        .post(`${baseUrl}/todos`)
        .send({ abc: 'test' });

      expect(connectionStub.addTodo.callCount).to.equal(0);
      expect(result).to.have.status(400);
    });

    it('should return status 400 if title in reuqets body is not a string', async () => {
      const result = await chai
        .request(server)
        .post(`${baseUrl}/todos`)
        .send({ title: 123 });

      expect(connectionStub.addTodo.callCount).to.equal(0);
      expect(result).to.have.status(400);
    });

    it('should add todo and return no body with staus 204', async () => {
      const result = await chai
        .request(server)
        .post(`${baseUrl}/todos`)
        .send({ title: 'abcdefg' });

      expect(connectionStub.addTodo.callCount).to.equal(1);
      expect(connectionStub.addTodo.firstCall.args[0]).to.equal('abcdefg');
      expect(result).to.have.status(204);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should return error message with status 500 if removeTodo rejects with an error', async () => {
      connectionStub.removeTodo.rejects(new Error('Some error.'));

      const result = await chai.request(server).delete(`${baseUrl}/todos/abc`);

      expect(connectionStub.removeTodo.callCount).to.equal(1);
      expect(result).to.have.status(500);
      expect(result.text).to.equal('Some error.');
    });

    it('should remove todo and return no body with staus 204', async () => {
      const result = await chai.request(server).delete(`${baseUrl}/todos/abc`);

      expect(connectionStub.removeTodo.callCount).to.equal(1);
      expect(connectionStub.removeTodo.firstCall.args[0]).to.equal('abc');
      expect(result).to.have.status(204);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should return error message with status 500 if changeTodoState rejects with an error', async () => {
      connectionStub.changeTodoState.rejects(new Error('Some error.'));

      const result = await chai
        .request(server)
        .put(`${baseUrl}/todos/abc`)
        .send({ state: false });

      expect(connectionStub.changeTodoState.callCount).to.equal(1);
      expect(result).to.have.status(500);
      expect(result.text).to.equal('Some error.');
    });

    it('should return status 400 if request body does not contain valid json with state', async () => {
      const result = await chai
        .request(server)
        .put(`${baseUrl}/todos/abc`)
        .send({ abc: 'test' });

      expect(connectionStub.changeTodoState.callCount).to.equal(0);
      expect(result).to.have.status(400);
    });

    it('should return status 400 if state in reuqets body is not a boolean', async () => {
      const result = await chai
        .request(server)
        .put(`${baseUrl}/todos/abc`)
        .send({ state: 123 });

      expect(connectionStub.changeTodoState.callCount).to.equal(0);
      expect(result).to.have.status(400);
    });

    it('should change todo state and return no body with staus 204', async () => {
      const result = await chai
        .request(server)
        .put(`${baseUrl}/todos/abc`)
        .send({ state: false });

      expect(connectionStub.changeTodoState.callCount).to.equal(1);
      expect(connectionStub.changeTodoState.firstCall.args[0]).to.equal('abc');
      expect(connectionStub.changeTodoState.firstCall.args[1]).to.equal(false);
      expect(result).to.have.status(204);
    });
  });

  describe('GET /todos', () => {
    it('should return error message with status 500 if getTodos rejects with an error', async () => {
      connectionStub.getTodos.rejects(new Error('Some error.'));

      const result = await chai.request(server).get(`${baseUrl}/todos`);

      expect(connectionStub.getTodos.callCount).to.equal(1);
      expect(result).to.have.status(500);
      expect(result.text).to.equal('Some error.');
    });

    it('should return todos as json with staus 200', async () => {
      connectionStub.getTodos.resolves([
        {
          id: '62c460f0-426f-4339-addb-5aab3a4bbc14',
          title: 'Test 1',
          state: true,
        },
        {
          id: '94a9e91a-a914-41e6-8f1c-9dcc16c71cac',
          title: 'Test 2',
          state: false,
        },
        {
          id: '75002238-941d-4738-8728-a81eae96cb4f',
          title: 'Test 4',
          state: true,
        },
        {
          id: '9cad782a-3e3c-4523-94ba-7b892379f6a9',
          title: 'Test 5',
          state: true,
        },
      ]);

      const result = await chai.request(server).get(`${baseUrl}/todos`);

      expect(connectionStub.getTodos.callCount).to.equal(1);
      expect(result).to.have.status(200);
      expect(result).to.have.json;
      expect(result.body).to.deep.equal([
        {
          id: '62c460f0-426f-4339-addb-5aab3a4bbc14',
          title: 'Test 1',
          state: true,
        },
        {
          id: '94a9e91a-a914-41e6-8f1c-9dcc16c71cac',
          title: 'Test 2',
          state: false,
        },
        {
          id: '75002238-941d-4738-8728-a81eae96cb4f',
          title: 'Test 4',
          state: true,
        },
        {
          id: '9cad782a-3e3c-4523-94ba-7b892379f6a9',
          title: 'Test 5',
          state: true,
        },
      ]);
    });
  });
});
