import {expect} from 'chai';
import hello from './index';

describe('hello', () => {
    it('should return Hello <name>!', () => {
        const input = 'test';
        const result = hello(input);
        expect(result).to.equal('Hello test!');
    });
})