---
layout: post
title: Screen scraping Google Spreadsheets exported as HTML
categories: []
tags:
  - javascript
  - prototype
status: publish
type: post
published: true
meta:
  _elasticsearch_indexed_on: '2007-11-03 06:08:38'
---

Let's say you had a wealth of information in a Google spreadsheet that you wanted to access using Javascript. And let's say you also forgot you could export the doc as a .csv file (or in my case, wanted to try your hand at javascript screen scraping). What's a super-simple way you could accomplish this?

Glad you asked, because I've got just the solution for you. It requires using Prototype, though you could use it with just about any other library which lets you use CSS selectors.

First, create an array with which to store your data:

```js
var items = [];
```

Then, you'll have want to create a function which takes the raw HTML input and parses it into a set of objects:

```js
function parseData(googleDoc) {
  var divItem = document.createElement('div');
  divItem.innerHTML = googleDoc;
  $(divItem).hide();
  document.body.appendChild(divItem);
  var tblMain = $('tblMain');

  $(tblMain)
    .getElementsBySelector('td.rAll')
    .each(function(n, i) {
      if (i == 0) {
        return; //if you have a header row, you don't want to include it
      }
      var item = n.parentNode;
      var kids = $(item).getElementsBySelector('td.g');
      items[i - 1] = parseRow(kids);
    });
  document.body.removeChild(divItem);
}

function parseRow(kids) {
  var obj = {};
  obj.title = kids[0].innerHTML;
  obj.column1 = kids[1].innerHTML;
  obj.column2 = kids[2].innerHTML;
  //...etc
  return obj;
}
```

Then, just pull up the document with an Ajax call:

```js
function loadData() {
  var req = new Ajax.Request('url/to/googleDoc.html', {
    method: 'get',
    onComplete: function(req) {
      googleDoc = req.responseText;
      parseData(googleDoc);
    },
  });
}
```

Simple, huh?
