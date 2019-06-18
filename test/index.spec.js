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
        let mdInstance = md();
        let instance = new plugin(mdInstance);
        expect(instance).to.have.property('options');
        expect(instance.options).to.have.property('wrapTag').to.equal('span');
        expect(instance.options).to.have.property('wrapClass').to.equal('pseudo-list');
        done();
    });

    it('checks text token', (done) => {
        let methodTested = plugin.__get__('isText');
        let dummyToken = new Token('text', '', 0);
        expect(methodTested(dummyToken)).to.be.true;
        done();
    });

    it('checks soft break token', (done) => {
        let methodTested = plugin.__get__('isSoftBreak');
        let dummyToken = new Token('softbreak', 'br', 0);
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

    it('checks pseudo list from a token array', (done) => {
        let methodTested = plugin.__get__('isPseudoList');
        let tokens = [];

        let textToken = new Token('text', '', 0);
        textToken.content = 'some text';

        let breakToken = new Token('softbreak', 'br', 0);

        let pseudoListToken = new Token('text', '', 0);
        pseudoListToken.content = 'vi)some text';

        tokens.push(textToken);
        tokens.push(breakToken);
        tokens.push(pseudoListToken);

        expect(methodTested(tokens, 2)).to.be.true;

        done();
    });

    it('inserts new token before given token position', (done) => {
        let methodTested = plugin.__get__('addTags');
        let tokens = [];

        let textToken = new Token('text', '', 0);
        textToken.content = 'some text';

        let breakToken = new Token('softbreak', 'br', 0);

        let pseudoListToken = new Token('text', '', 0);
        pseudoListToken.content = 'vi)some text';

        tokens.push(textToken);
        tokens.push(breakToken);
        tokens.push(pseudoListToken);

        methodTested(tokens, 2, Token);

        expect(tokens).to.have.length.greaterThan(3);
        expect(tokens[2]).to.be.instanceOf(Token);
        expect(tokens[2]).to.have.property('type', 'pseudo_list_open');
        done();
    });

    it('inserts new token after given token position', (done) => {
        let methodTested = plugin.__get__('addTags');
        let tokens = [];

        let textToken = new Token('text', '', 0);
        textToken.content = 'some text';

        let breakToken = new Token('softbreak', 'br', 0);

        let pseudoListToken = new Token('text', '', 0);
        pseudoListToken.content = 'vi)some text';

        tokens.push(textToken);
        tokens.push(breakToken);
        tokens.push(pseudoListToken);

        methodTested(tokens, 2, Token);

        expect(tokens).to.have.length.greaterThan(4);
        expect(tokens[4]).to.be.instanceOf(Token);
        expect(tokens[4]).to.have.property('type', 'pseudo_list_close');
        done();
    });

    it('renders our tags with classes', (done) => {
        let mdInstance = md();
        mdInstance.use(plugin);

        let result = mdInstance.render(`some text
a)literal list`);
        expect(result).to.be.a('string');
        expect(result).to.equal('<p>some text\n' +
            '<span class="pseudo-list literal">a)literal list</span></p>\n');

        let result2 = mdInstance.render(`some text
ii)roman list`);
        expect(result2).to.be.a('string');
        expect(result2).to.equal('<p>some text\n' +
            '<span class="pseudo-list roman">ii)roman list</span></p>\n');
        done();
    });

    it('gets pseudo list type from token', (done) => {
        let methodTested = plugin.__get__('getListType');
        let dummyToken = new Token('text', '', 0);
        dummyToken.content = 'a)some text';
        expect(methodTested(dummyToken)).to.equal('literal');
        dummyToken.content = 'ii)some text';
        expect(methodTested(dummyToken)).to.equal('roman');
        dummyToken.content = '20)some text';
        expect(methodTested(dummyToken)).to.equal('numeral');
        dummyToken.content = '-some text';
        expect(methodTested(dummyToken)).to.equal('dash');
        done();
    });

    it('renders the readme example', (done) => {
        let mdInstance = md();
        mdInstance.use(plugin);

        let result = mdInstance.render(`
some text
a)oh, here's
b)my
c)list
`);
        expect(result).to.be.a('string');
        done();
    })
});