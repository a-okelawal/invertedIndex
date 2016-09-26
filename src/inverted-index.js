(function () {
  "use strict";

  //Require File System module
  const fs = require('fs');

  //Function to create a word index array out of json files
  class invIndexScript {

    constructor() {
      //wordIndex has current word index and jsonObject has current index's json form
      this.wordIndex = [];
      //Variable that contains the  current index's json form
      this.jsonObject =  {};
      ////Variable Array that contains the word index array of all files
      this.collection = {};
      //Variable that contains the json forms of all files
      this.jsonCollection = {};
      //Temporary array to store search results
      this.tempSearch = [];
      //Temporary Variable to use for each word in the token array
      this.temp = '';
      //Variable string to use for search result
      this.full = '';
      //Variable used during search
      this.tempArray = [];
    }


    //Function to create the wordIndex from the file
    createIndex(filePath, callback) {

      this.wordIndex = [];
      //Check if file exists
      if (fs.existsSync(filePath)) {
        //Stores the name of the file and converst to json form
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            console.log(err);
          }
          //Add word index array to the collection using the name of the file
          this.collection[filePath] = this.process(filePath, data);
          callback(null, data);
        });
      } else {
        throw new Error ('File does not exist.');
      }
    }

    //Function to return the jsonObject of the files
    getJsonObject(file) {
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
      if (this.jsonObject.length) {
        return this.jsonObject;
      } else {
        throw new Error("There is no Array of Indeces.");
      }
    }

    //Function to return word index of the files
    getIndex(file) {
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
      if (this.wordIndex.length) {
        return this.wordIndex;
      } else {
        throw new Error("Array is Empty.");
      }
    }

    //Function to search through created word indices
    searchIndex() {
      let pass = new Date();
      let now = pass.getTime()/1000;

      //Reset the arrays
      this.tempArray = [];

      //Variable to hold the tokens
      let tokens = [];
      tokens = this.tokenizer(arguments);

      //Variable to hold results
      let result = [];

      //Variable to hold the keys for the collection of word indices
      let indices = Object.keys(this.collection);

      //Looping through and searching for word
      for (let z = 0; z < indices.length; z++) {

        this.wordIndex = this.collection[indices[z]];
        let name = indices[z];

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
              if (item === query && found === false) {
                result = this.wordIndex[j][item];
                console.log(`${query} was found in ${name} in the objects ${this.wordIndex[j][item]}"\n`);
                found = true;
              }
            }
          }
        }
      }
      if (((pass.getTime()/1000) - now) > 0) {
        throw new Error('Search took too long.');
      }

      //Return the array of inicies.
      return result;
    }

    process(filePath, data) {
      if (data.length <= 0) {
        throw new Error ('The file is empty.');
      }

      try {
        data = JSON.parse(data);
      } catch (e) {
        throw new Error ('The file does not contain an Array.');
      }

      if (data.length <= 0) {
        throw new Error ('The file Array is empty.');
      }

      if (Object.keys(data[0]).length <= 0) {
        throw new Error ('The file Array Object is empty.');
      }

      for (let i = 0, object; (object = data[i]); i++) {
        if (typeof object.title === 'string' && typeof object.text === 'string') {
          /*
           *combine the strings in the object and
           *split all the words and put them into an array
          */
          let tempString = `${object.title.toString().toLowerCase()}
          ${object.text.toString().toLowerCase()}`.replace(/[^a-zA-Z 0-9]+/g,' ');
          let tokens = tempString.split(" ");
          tokens = tokens.filter(Boolean);

          //Add words to the index
          this.addToIndex(tokens, i);
        } else {
          throw new Error ('The object is not a string.');
        }
      }
      //stores json object with the name
      this.jsonCollection[filePath] = data;
      return this.wordIndex;
    }

    addToIndex(tokens, i) {

      for (let j = 0; j < tokens.length; j++) {
        let temp = tokens[j].toString().replace(/[^a-zA-Z 0-9]+/g,'');
        let check = true;
        let obj = {};
        /*
        *Check if element exists and if it does, just add the index to the file else add
        *the word and the index.
        */
        for (let key of this.wordIndex) {
          for (let element in key) {
            if (element === temp && key[element].toString().indexOf(i.toString()) === -1) {
              check = false;
              key[element].push(i);
            }
          }
        }
        if (check) {
          obj[temp] = [i];
          this.wordIndex.push(obj);
        }
      }
    }

    tokenizer(fullQuery) {

      let tempToken = [];

      //Check if the query is a string, if so split the words into an array
      //else flatten into a 1 level array.
      if (typeof(fullQuery) === 'string') {
        tempToken  = fullQuery.split(" ");
      } else {
        tempToken = this.flatten(fullQuery);
      }

      return tempToken;
    }

    flatten() {
      for (let arg of arguments){
       if (arg instanceof Object && typeof arg !== 'string' ) {
         for (let item in arg){
           if (Object.prototype.hasOwnProperty.call(arg, item) ){
             this.flatten(arg[item]);
           }
         }
       } else {
         this.tempArray.push(arg);
       }
     }
     return this.tempArray;
    }
  }

  module.exports = invIndexScript;

} ());
