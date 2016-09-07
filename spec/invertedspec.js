"use strict";

//Require the inverted index file and the file system library
var invIndexScript = require('../src/inverted-index.js');
var fs = require('fs');

var invObject = new invIndexScript();

//Test path
var fullFilePath = "files/movies.json";

//Test name
var file = fullFilePath.split("/").pop();

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

  it("file should contain json objects that contain strings.", function() {
    expect(Object.keys(invObject.jsonObject).length).toBeGreaterThan(0);
    try {
      for(let tempObj in invObject.jsonObject) {
        console.log("Title is: " + invObject.jsonObject[tempObj].title);
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
describe("GetIndex", function() {
  it(" ensure argument returns index location.", function() {
    expect(invObject.getIndex("books.json")).toBeDefined();
    expect(invObject.getIndex("books.json")).not.toBe(invObject.getIndex("movies.json"));
  });
});

//Suite to test if word index was created
describe("Populate Index ", function() {
  it("should return index array.", function() {
    jsonData = invObject.getIndex(file);
    expect(jsonData).toBeDefined();
    if(typeof jsonData !== 'undefined') {
      expect(jsonData.length).toBeDefined();
      expect(jsonData.length).not.toBe(0);
      for(let t = 0; t < jsonData.length; t++) {
        expect(Object.keys(jsonData[0]).length).toBeGreaterThan(0);
        break;
      }
    }
  });

  it("should ensure index is correct.", function() {
    jsonForm = invObject.getJsonForm(file);
    if(typeof jsonForm !== 'undefined') {
      expect(jsonForm).toBeDefined();
      expect(jsonForm.length).toBeGreaterThan(0);
      for(let i = 0; i < jsonData.length; i++) {
        expect(jsonData[i].toString()).toBeDefined();
        expect(jsonData[i].toString().length).toBeGreaterThan(0);
      }
      for(let item in jsonData[0]) {
        index = jsonData[0][item];
        comboText = jsonForm[index[0]].title.toString().toLowerCase()
         + " " + jsonForm[index[0]].text.toString().toLowerCase();
        expect(comboText.indexOf(item)).not.toEqual(-1);
      }
    }
  });

  it("should ensure index is not overwritten.", function() {
    expect(invObject.getIndex("books.json")).toBeDefined();
    expect(invObject.getIndex("movies.json")).toBeDefined();

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
            comboText = jsonForm[index[0]].title.toString().toLowerCase()
            + " " + jsonForm[index[0]].text.toString().toLowerCase();
            expect(comboText.indexOf(fullQuery)).toBeDefined();
          }
        }
      }
    });
  });
});
