'use strict';

const defaults = {
    wrapTag: 'span',
    wrapClass: 'indent-text',
};

module.exports = function MarkdownItPseudoLists(md, options) {
    this.options = Object.assign({}, defaults, options);

    return this;
};

function isPseudoList(tokens, index) {
    return isInline(tokens[index]) &&
        isParagraph(tokens[index - 1]) &&
        isStartedWithPseudoMarker(tokens[index]);
}

function isInline(token) { return token.type === 'inline'; }

function isParagraph(token) { return token.type === 'paragraph_open'; }

function isStartedWithPseudoMarker(token) {
    return /^(-|[a-z]\)|[ivx]+\)|[0-9]+\))/.test(token.content);
}