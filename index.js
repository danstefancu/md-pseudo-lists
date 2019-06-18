'use strict';

const defaults = {
    wrapTag: 'span',
    wrapClass: 'pseudo-list',
};

module.exports = function MarkdownItPseudoLists(md, options) {
    this.options = Object.assign({}, defaults, options);

    md.inline.ruler2.after('text_collapse', 'md-pseudo-lists', addRule);

    return this;
};
function addRule(state) {
    const tokens = state.tokens;
    // start at 1 because we check for a soft break before (i-1) our pseudo list
    for (let i = 1; i < tokens.length; i++) {

        if (isPseudoList(tokens, i)) {
            addTags(tokens, i, state.Token);
        }
    }
}

function addTags(tokens, i, Token) {
    tokens.splice(i, 0, insertBefore(Token, tokens[i]));
    tokens.splice(i+2, 0, insertAfter(Token));
}

function insertBefore(Constructor, token) {
    let newToken = new Constructor('pseudo_list_open', defaults.wrapTag, 1);

    newToken.attrJoin('class', defaults.wrapClass);
    newToken.attrJoin('class', token.pseudoListType);

    return newToken;
}

function insertAfter(Constructor) {
    return new Constructor('pseudo_list_close', defaults.wrapTag, -1);
}

function isPseudoList(tokens, index) {
    return isText(tokens[index]) &&
        isSoftBreak(tokens[index - 1]) &&
        isStartedWithPseudoMarker(tokens[index]);
}

function isText(token) { return token.type === 'text'; }

function isSoftBreak(token) { return token.type === 'softbreak'; }

function isStartedWithPseudoMarker(token) {
    let type = getListType(token);

    if (false === type) {
        return false;
    }

    token.pseudoListType = type;

    return true;
}

function getListType(token) {
    let types = {
        'literal': /^[a-z]\)/,
        'dash': /^\u002d|\u2013/,
        'roman': /^[ivxIVX]+\)/,
        'numeral': /^[0-9]+\)/
    };

    for (let type in types) {
        if (types[type].test(token.content))
            return type;
    }

    return false;
}