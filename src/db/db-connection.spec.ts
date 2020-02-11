import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { ConnectionError, DatabasePoolType } from 'slonik';
import { normalizeQuery } from '../../test-helper/normalizeQuery';
import { DbConnection } from './db-connection';

chai.use(chaiAsPromised);

describe('DbConnection', () => {
  /* tslint:disable-next-line no-any */
  let poolStub: any;
  let connection: DbConnection;

  beforeEach(() => {
    poolStub = {} as DatabasePoolType;
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
      expect(normalizeQuery(poolStub.query.firstCall.args[0].sql)).to.equal(
        'INSERT INTO todos(title, state) VALUES ($1, true)'
      );
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
      expect(normalizeQuery(poolStub.query.firstCall.args[0].sql)).to.equal('DELETE FROM todos WHERE id=$1');
      expect(poolStub.query.firstCall.args[0].values).to.deep.equal(['id']);
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
      expect(normalizeQuery(poolStub.query.firstCall.args[0].sql)).to.equal('UPDATE todos SET state=$1 WHERE id=$2');
      expect(poolStub.query.firstCall.args[0].values).to.deep.equal([false, 'id']);
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
          id: '1',
          title: 'Test 1',
          state: true,
        },
        {
          id: '2',
          title: 'Test 2',
          state: false,
        },
        {
          id: '3',
          title: 'Test 4',
          state: true,
        },
        {
          id: '4',
          title: 'Test 5',
          state: true,
        },
      ]);

      const result = await connection.getTodos();

      expect(poolStub.any.callCount).to.equal(1);
      expect(normalizeQuery(poolStub.any.firstCall.args[0].sql)).to.equal('SELECT * FROM todos ORDER BY id');

      expect(result).to.deep.equal([
        {
          id: '1',
          title: 'Test 1',
          state: true,
        },
        {
          id: '2',
          title: 'Test 2',
          state: false,
        },
        {
          id: '3',
          title: 'Test 4',
          state: true,
        },
        {
          id: '4',
          title: 'Test 5',
          state: true,
        },
      ]);
    });
  });
});
