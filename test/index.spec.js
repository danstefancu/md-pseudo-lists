'use strict';

const expect = require('chai').expect;
const md = require('markdown-it');
const plugin = require('..');

describe('Plugin', () => {
    it('runs without errors', (done) => {
        expect(() => md().use(plugin)).to.not.throw();
        done();
    });
});