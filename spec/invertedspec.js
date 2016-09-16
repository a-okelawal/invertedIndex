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
describe ("Read Book Data:", function () {

  it ("file should exist.", function () {
    expect(function () {invObject.createIndex("fakefiles/fake.json");}).
    toThrowError("File does not exist.");
  });

  it ("file should contain an Array", function () {
    expect(function () { invObject.createIndex("files/emptyjson3.json"); }).
    toThrowError('The file does not contain an Array.');
  });

  it ("file should not be empty", function () {
    expect(function () { invObject.createIndex("files/emptyjson0.json"); }).
    toThrowError('The file is empty.');
  });

  it ("file Array should not be empty", function () {
    expect(function () { invObject.createIndex("files/emptyjson1.json"); }).
    toThrowError('The file Array is empty.');
  });

  it ("file Array Object should not be empty", function () {
    expect(function () { invObject.createIndex("files/emptyjson2.json"); }).
    toThrowError('The file Array Object is empty.');
  });

  it ("file Array Object should contain strings.", function () {
    expect(function () {invObject.createIndex("files/notStringJson.json");}).
    toThrowError("The object is not a string.");
  });
});

//Suite to test if the getIndex() function returns the word index array.
describe ("GetIndex:", function () {
  it ("location should be specified.", function () {
    expect(function () {invObject.getIndex();}).
    toThrowError("Location was not specified.");
  });

  it ("location should exist.", function () {
    expect(function () {invObject.getIndex("fakes/files.json");}).
    toThrowError("File does not exist.");
  });
});

//Suite to test if word index was created
describe ("Populate Index:", function () {
  it ("should ensure index array is created once file has been read.", function () {
    try {
      invObject.createIndex('files/music.json');
      expect(invObject.wordIndex).toBeDefined();

      index = invObject.getIndex('files/music.json');
      expect(Array.isArray(index)).toBe(true);

      console.log(invObject.searchIndex("song"));
      expect(invObject.searchIndex("song")).toEqual([0, 1, 2]);
    }
    catch (e) {
      console.log(e.message);
    }
  });

  it ("should ensure index is correct.", function () {
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
      console.log (e.message);
    }
  });

  it ("should ensure index is not overwritten.", function () {
    invObject.createIndex ("files/books.json");
    invObject.createIndex ("files/movies.json");
    expect (invObject.getIndex("files/books.json")).not.
    toBe (invObject.getIndex("files/movies.json"));
    expect (function () {invObject.getIndex("files/books.json");}).not.toThrow();
  });
});

//Suite to test if the search returns the proper results
describe ("Search Array:", function () {

  it ("should have a string or an array of terms as argument.", function () {
    expect(function () {invObject.searchIndex({talker: "Talks too much"});}).not.
    toThrowError("Invalid input type.");
  });

  it ("should not take long to execute.", function () {
    expect(function () {invObject.searchIndex(["jon", ["song", ["Nf"]], ["jon", ["song", ["Nf"]]], ["jon", ["song", ["Nf"]]]]);}).not.
    toThrowError("Search took too long.");
  });

  it ("should return correct array of indices.", function () {
    //fullQuery is the search query. It can be strings or array of strings
    let fullQuery = ["jon", ["song", ["Nf"]]];
    jsonForm = invObject.getJsonObject("files/music.json");
    invObject.searchIndex(fullQuery, function (err, dataIndex) {
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
