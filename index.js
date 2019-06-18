'use strict';

const defaults = {
    wrapTag: 'span',
    wrapClass: 'indent-text',
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
    tokens.splice(i, 0, insertBefore(Token));
    tokens.splice(i+2, 0, insertAfter(Token));
}

function insertBefore(Constructor) {
    let token = new Constructor('pseudo_list_open', defaults.wrapTag, 1);
    token.attrs = [['class', defaults.wrapClass]];

    return token;
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
    // minus, en dash, a), iii), 10)
    return /^(\u002d|\u2013|[a-z]\)|[ivx]+\)|[0-9]+\))/.test(token.content);
}