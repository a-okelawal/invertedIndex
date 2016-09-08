"use strict";
//Function to create a word index array out of json files
class invIndexScript {

  constructor () {
    //Variable that contains the current index's word index array
    this.wordIndex = [];
    //Variable that contains the  current index's json form
    this.jsonObject =  {};
    ////Variable Array that contains the word index array of all files
    this.collection = {};
    //Variable that contains the json forms of all files
    this.jsonCollection = {};
    //Temporary variable to use to store the file names
    this.name = "";
    //Temporary array to store search results
    this.tempSearch = [];
    //Temporary Variable to use for each word in the token array
    this.temp = "";
    //Variable string to use for search result
    this.full = "";
    //Require File System module
    this.fs = require('fs');
    //Require library module array from lodash
    this.array = require('lodash/array');
  }


  //Function to create the wordIndex from the file
  createIndex (filePath) {
    this.wordIndex = [];

    //Check if file exists
    if (this.fs.existsSync(filePath)) { //Correct this
      //Stores the name of the file and converst to json form
      this.name = filePath;
      let content = this.fs.readFileSync(filePath);//Read asynchronous
      if (content.length <= 0) {
        throw new Error ('The file is empty.');
      }

      this.jsonObject = JSON.parse(content);
      if (this.jsonObject.length <= 0) {
        throw new Error ('The file Array is empty.');
      }

      if (Object.keys(this.jsonObject[0]).length <= 0) {
        throw new Error ('The file Array Object is empty.');
      }

      //stores json object with the name
      this.jsonCollection[this.name] = this.jsonObject;
      let tmpArr = Object.keys(this.jsonObject);

      for (let i = 0; i < this.jsonObject.length; i++) {
        if (typeof this.jsonObject[i].title !== 'undefined' || typeof this.jsonObject[i].text !== 'undefined') {
          if (typeof this.jsonObject[i].title !== 'string' || typeof this.jsonObject[i].text !== 'string') {
            throw new Error ("The object is not a string.");
          }
          /*
           *combine the strings in the object and
           *split all the words and put them into an array
          */
          let tokens = `${this.jsonObject[i].title.toString().toLowerCase()}
          ${this.jsonObject[i].text.toString().toLowerCase()}`.split(" ");

          let obj = {};

          for (let j = 0; j < tokens.length; j++) {
            let temp = tokens[j].toString().replace(/[^a-zA-Z 0-9]+/g,'');
            let check = true;
            //Check if it's the first iteration and put the first word
            if (i === 0 && j === 0) {
              obj[temp] = [i];
              this.wordIndex.push(obj);
            }
            else {
              /*
              *Check if element exists and if it does, just add the index to the file else add
              *the word and the index.
              */
              for (let key of this.wordIndex) {
                for (let element in key) {
                  if (element === temp) {
                    check = false;
                    if (key[element].toString().indexOf(i.toString()) === -1) {
                      key[element].push(i);
                    }
                  }
                }
              }
              if (check) {
                obj = {};
                obj[temp] = [i];
                this.wordIndex.push(obj);
              }
            }
          }
        }
      }
      //console.log (`Word Index for "${this.name}" Created.\n`);
    }
    else {
      throw new Error ("File does not exist.");
    }

    //Add word index array to the collection using the name of the file
    this.collection[this.name] = this.wordIndex;
    return this.wordIndex;
  }

  //Function to return the jsonObject of the files
  getJsonObject (file) {
    //Check if argument is empty, if it so, throw an error.
    if (typeof file === 'undefined') {
      throw new Error("Location was not specified.");
    }

    //Get index from argument and get json object
    this.jsonObject = this.jsonCollection[file];

    //Check if the json object with the name exists
    if (typeof this.jsonCollection[file] === 'undefined') {
      throw new Error(`Index Array for file "${file}" does not exist`);
    }
    if (this.jsonObject.length !== 0) {
      return this.jsonObject;
    }
    else {
      throw new Error("There is no Array of Indeces.");
    }
  }

  //Function to return word index of the files
  getIndex (file) {
    //Check if argument is empty, if it is, throw an error.
    if (typeof file === 'undefined') {
      throw new Error ("Location was not specified.");
    }

    //Get index from argument and get the word index array
    this.wordIndex = this.collection[file];

    //Check if the word index with the name exists
    if (typeof this.collection[file] === 'undefined') {
      throw new Error(`File does not exist.`);
    }
    if (this.wordIndex.length !== 0) {
      return this.wordIndex;
    }
    else {
      throw new Error("Array is Empty.");
    }
  }

  //Function to search through created word indices
  searchIndex (fullQuery) {
    let pass = new Date();
    let now = pass.getTime()/1000;
    console.log(now);

    //Variable to hold the tokens
    let tokens = [];

    //Check if the query is a string, if so split the words into an array.
    if (typeof(fullQuery) === typeof("tolu")) {
      tokens  = fullQuery.split(" ");
    }

    //Check if the query is an array, if so, flatten into a 1 level array.
    else if (Array.isArray(fullQuery)) {
      tokens = this.array.flattenDepth(fullQuery, 1);
    }
    else {
      throw new Error("Invalid input type.");
    }

    //Variable to hold results
    let result = [];

    //Variable to hold the keys for the collection of word indices
    let indices = Object.keys(this.collection);


    //Looping through and searching for word
    for (let z = 0; z < indices.length; z++) {

      this.wordIndex = this.collection[indices[z]];
      this.name = indices[z];

      //Loop through the array
      for (let i = 0; i < tokens.length; i++) {
        let found = false;
        let query = tokens[i].toString().replace(/[^a-zA-Z 0-9]+/g,'').toLowerCase();

        /*
        *Loop through the the word index array, compare words and add array of
        *indices from word index to the result array if found.
        */
        for (let j = 0; j< this.wordIndex.length;j++) {
          for (let item in this.wordIndex[j]) {
            if (item === query) {
              result = this.wordIndex[j][item];
              console.log(`${query} was found in ${this.name} in the objects ${this.wordIndex[j][item]}"\n`);
            }
          }
        }
      }
    }
    let done = pass.getTime()/1000;
    if ((done - now) > 0) {
      throw new Error('Search took too long.');
    }

    //Return the array of inicies.
    return result;
  }
}

module.exports = invIndexScript;
