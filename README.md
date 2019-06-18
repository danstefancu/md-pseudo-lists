# md-pseudo-lists

A markdown-it plugin for parsing and tokenizing pseudo lists, such as: 

`a)some text` 

`ii)some other text`

`-not really a list`

`12)pseudo ordered list`

## How does it work

The plugin identifies these pseudo lists by the starting markers, while being separated by a (single) line brake. 

Each line is wrapped in a `span` with `.pseudo-list` class and the type: `.literal`, `.roman`, `.numeral` and `.dash`

## Install

node.js:

```bash
npm i md-pseudo-lists --save
```

## Use

```js
const md = require('markdown-it')();
const MarkdownItPseudoLists = require('md-pseudo-lists');

md.use(MarkdownItPseudoLists);

md.render(`
some text
a)oh, here's
b)my
c)list
`);

/** ==>
  <p>some text<br>
  <span class="pseudo-list literal">a)oh, here's</span><br>
  <span class="pseudo-list literal">b)my</span><br>
  <span class="pseudo-list literal">c)list</span></p>
**/
```