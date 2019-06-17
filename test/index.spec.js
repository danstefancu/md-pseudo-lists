'use strict';

const expect = require('chai').expect;
const md = require('markdown-it');
const Token = require('markdown-it/lib/token');
const rewire = require("rewire");
const plugin = rewire('../index.js');

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

    it('checks inline token', (done) => {
        let methodTested = plugin.__get__('isInline');
        let dummyToken = new Token('inline', '', 0);
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('checks paragraph open token', (done) => {
        let methodTested = plugin.__get__('isParagraph');
        let dummyToken = new Token('paragraph_open', 'p', 1);
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('checks - as pseudo marker', (done) => {
        let methodTested = plugin.__get__('isStartedWithPseudoMarker');
        let dummyToken = new Token('paragraph_open', 'p', 1);
        dummyToken.content = '- some text';
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('checks a) b) c) as pseudo marker', (done) => {
        let methodTested = plugin.__get__('isStartedWithPseudoMarker');
        let dummyToken = new Token('paragraph_open', 'p', 1);
        dummyToken.content = 'a) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = 'b) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = 'c) some text';
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('checks i) ii) iv) xi) as pseudo marker', (done) => {
        let methodTested = plugin.__get__('isStartedWithPseudoMarker');
        let dummyToken = new Token('paragraph_open', 'p', 1);
        dummyToken.content = 'i) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = 'ii) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = 'iv) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = 'xi) some text';
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('checks 1) 2) 23) 10) as pseudo marker', (done) => {
        let methodTested = plugin.__get__('isStartedWithPseudoMarker');
        let dummyToken = new Token('paragraph_open', 'p', 1);
        dummyToken.content = '1) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = '2) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = '23) some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = '10) some text';
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('checks a) vi) - without space next to text as pseudo marker', (done) => {
        let methodTested = plugin.__get__('isStartedWithPseudoMarker');
        let dummyToken = new Token('paragraph_open', 'p', 1);
        dummyToken.content = 'a)some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = 'vi)some text';
        expect(methodTested(dummyToken)).to.be.true;
        dummyToken.content = '-some text';
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('sends tokens', (done) => {
        expect(() => md().use(plugin)).to.not.throw();
        done();
    });
});