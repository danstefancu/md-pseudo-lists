'use strict';

let defaults = {
    wrapTag: 'span',
    wrapClass: 'indent-text',
};

module.exports = function MarkdownItPseudoLists(md, options) {
    this.options = Object.assign({}, defaults, options);

    return this;
};
