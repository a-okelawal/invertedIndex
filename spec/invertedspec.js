"use strict";

//Require the inverted index file and the file system library
var invIndexScript = require('../src/inverted-index.js');
var fs = require('fs');

var invObject = new invIndexScript();

//Test path
var fullFilePath = "files/music.json";

//Test name
var file = fullFilePath;

//Variables used for storing the ArrayData and for Storing the jsonForm
var jsonData = [];
var jsonForm = {};

//Variable for combining strings in the json object
let comboText = "";

//Variable to hold array of indices for words in the Array Index
let index;

//Suite to test if book data is empty
describe("Read Book Data:", function() {
  it("file should exist.", function() {
    try {
      //index = invObject.createIndex("jasmine/books.json");
      index = invObject.createIndex("files/books.json");
      expect(index).toBeDefined();
    }
    catch(e) {
      console.log(e.message);
    }
  });

  it("file should not be empty", function(){
    expect(Object.keys(invObject.jsonObject).length).toBeGreaterThan(0);
  });

  it("file should contain json objects that contain strings.", function(){
    expect(Object.keys(invObject.jsonObject).length).toBeGreaterThan(0);
    try {
      for(let tempObj in invObject.jsonObject) {
        expect(invObject.jsonObject[tempObj].title).toBeDefined();
        expect(typeof(invObject.jsonObject[tempObj].title)).toBe(typeof("title"));
        expect(invObject.jsonObject[tempObj].text).toBeDefined();
        expect(typeof(invObject.jsonObject[tempObj].text)).toBe(typeof("title"));
      }
    }
    catch (e) {
      console.log(e.message);
    }
  });
});

//Suite to test if the getIndex() function returns the word index array.
describe("GetIndex:", function() {
  it(" ensure argument returns index at the specified location.", function() {
    try {
      expect(invObject.getIndex()).toBeUndefined();
      expect(invObject.createIndex("files/movies.json")).
      toBe(invObject.getIndex("files/movies.json"));
      expect(invObject.getIndex("files/movies.json")).
      toBe(invObject.getIndex("files/books.json"));
    }
    catch (e) {
      console.log(e.message);
    }
  });
});

//Suite to test if word index was created
describe("Populate Index:", function() {
  it("should ensure index array is created once file has been read.", function() {
    try {
      index = [];
      index = invObject.createIndex('files/music.json');
      expect(Array.isArray(index)).toBe(true);
      for(let t = 0; t < index.length; t++) {
        expect(Object.keys(index[t]).length).toBeGreaterThan(0);
        break;
      }
    }
    catch (e) {
      console.log(e.message);
    }
  });

  it("should ensure index is correct.", function() {
    try {
      jsonForm = invObject.getJsonObject(file);
      jsonData = invObject.getIndex(file);

      expect(jsonForm).toBeDefined();

      for(let i = 0; i < jsonData.length; i++) {
        expect(jsonData[i].toString()).toBeDefined();
        for(let item in jsonData[i]) {
          index = jsonData[i][item];
          comboText = jsonForm[index[0]].title.toString().toLowerCase() +
          " " + jsonForm[index[0]].text.toString().toLowerCase();
          expect(comboText.indexOf(item)).not.toEqual(-1);
        }
      }
    }
    catch (e) {
      console.log(e.message);
    }
  });

  it("should ensure index is not overwritten.", function() {
    expect(invObject.getIndex("files/books.json")).toBeDefined();
    expect(invObject.getIndex("files/music.json")).toBeDefined();
    expect(invObject.getIndex("files/books.json")).not.
    toBe(invObject.getIndex("files/music.json"));
  });
});

//Suite to test if the search returns the proper results
describe("Search Array ", function() {
  it("should return array of indices.", function() {
    //fullQuery is the search query. It can be strings or array of strings
    let fullQuery = "wonder kid strange";
    jsonForm = invObject.getJsonForm(file);
    invObject.searchIndex(file, fullQuery, function(err, dataIndex) {
      expect(jsonData).toBeDefined();
      if(typeof dataIndex !== 'undefined') {
        for(let i = 0; i < dataIndex.length; i++) {
          let tempIndex = dataIndex[i];
          for(let item in jsonData[tempIndex]) {
            index = jsonData[tempIndex][item];
            comboText = jsonForm[index[0]].title.toString().toLowerCase() +
            " " + jsonForm[index[0]].text.toString().toLowerCase();
            expect(comboText.indexOf(fullQuery)).toBeDefined();
          }
        }
      }
    });
  });
});
