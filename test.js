"use strict";

var invScript = require('./src/inverted-index.js');
var invFactory = new invScript();

try {
  invFactory.createIndex('./files/books.json');
}
catch(e){
  console.log(e.message);
}
