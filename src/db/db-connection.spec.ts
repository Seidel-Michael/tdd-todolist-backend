import { DbConnection } from './db-connection';
import { expect } from 'chai';
import * as chai from 'chai'
import * as sinon from 'sinon';
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
import {normalizeQuery} from '../../test-helper/normalizeQuery';

import {DatabasePoolType} from 'slonik';


describe.only('DbConnection', () => {
    let poolStub:any;
    let connection:DbConnection;
    beforeEach(() => {
        poolStub = <DatabasePoolType>{
        };
        poolStub.query = sinon.stub();

        connection = new DbConnection(poolStub);
    });

    describe('addTodo', () => {
        it('should reject with TypeError if title is undefined');

        it('should reject with TypeError if title is null');

        it('should reject with TypeError if title is not a number');
        it('should reject with TypeError if title is not an object');

        it('should reject with Error if database connection failed');
        it('should reject with Error if insert into database failed');

        it('should insert todo in database and resolve', async () => {
            await connection.addTodo('abcdefg');

            expect(poolStub.query.callCount).to.equal(1);
            expect(normalizeQuery(poolStub.query.firstCall.args[0].sql)).to.equal('INSERT INTO todos(title, state) VALUES ($1, true)');
            expect(poolStub.query.firstCall.args[0].values).to.deep.equal(['abcdefg']);
        });
    });
});