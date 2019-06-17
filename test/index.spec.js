'use strict';

const expect = require('chai').expect;
const md = require('markdown-it');
const plugin = require('..');

describe('Plugin', () => {
    it('runs without errors', (done) => {
        expect(() => md().use(plugin)).to.not.throw();
        done();
    });

    it('sets default options', (done) => {
        let instance = new plugin();
        expect(instance).to.have.property('options');
        expect(instance.options).to.have.property('wrapTag').to.equal('span');
        expect(instance.options).to.have.property('wrapClass').to.equal('indent-text');
        done();
    });
});