"use strict";

var invScript = require('./src/inverted-index.js');
var invFactory = new invScript();

try {
  invFactory.createIndex('./files/emptyjson0.json');
  //invFactory.searchIndex(["alice"], ["wonderland", ["lord", {'a': "rings"}]]);
}
catch(e){
  console.log(e.message);
}
