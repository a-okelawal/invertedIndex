"use strict";

var invScript = require('./src/inverted-index.js');
var invFactory = new invScript();

try {
  invFactory.createIndex('./files/books.json');
  //invFactory.searchIndex("alice");
  invFactory.searchIndex(["alice"], ["wonderland", ["lord", {'a': "rings"}]]);
}
catch(e){
  console.log(e.message);
}
