"use strict";
//Function to create a word index array out of json files
class invIndexScript {

  constructor() {
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

    this.fs = require('fs');
  }


  //Function to create the wordIndex from the file
  createIndex(filePath) {

    //Check if file exists
    if(this.fs.existsSync(filePath)) { //Correct this
      //Stores the name of the file and converst to json form
      //this.name = filePath.split("/").pop();
      this.name = filePath;
      let content = this.fs.readFileSync(filePath);//Read asynchronous
      this.jsonObject = JSON.parse(content);
      if(this.jsonObject.length <= 0) {
        throw new Error ("The file is empty");
      }

      //stores json object with the name
      this.jsonCollection[this.name] = this.jsonObject;
      let tmpArr = Object.keys(this.jsonObject);

      for(let i = 0; i < this.jsonObject.length; i++) {
        if(typeof this.jsonObject[i].title !== 'undefined' || typeof this.jsonObject[i].text !== 'undefined') {
          if(typeof this.jsonObject[i].title !== 'string' || typeof this.jsonObject[i].text !== 'string') {
            throw new Error ("The object is not a string.");
          }
          /*
           *combine the strings in the object and
           *split all the words and put them into an array
          */
          let tokens = `${this.jsonObject[i].title.toString().toLowerCase()}
          ${this.jsonObject[i].text.toString().toLowerCase()}`.split(" ");

          let obj = {};

          for(let j = 0; j < tokens.length; j++) {
            let temp = tokens[j].toString().replace(/[^a-zA-Z 0-9]+/g,'');
            let check = true;
            //Check if it's the first iteration and put the first word
            if(i === 0 && j === 0) {
              obj[temp] = [i];
              this.wordIndex.push(obj);
            }
            else{
              /*
              *Check if element exists and if it does, just add the index to the file else add
              *the word and the index.
              */
              for(let key of this.wordIndex) {
                for(let element in key) {
                  if(element === temp) {
                    check = false;
                    if(key[element].toString().indexOf(i.toString()) === -1) {
                      key[element].push(i);
                    }
                  }
                }
              }
              if(check) {
                obj = {};
                obj[temp] = [i];
                this.wordIndex.push(obj);
              }
            }
          }
        }
      }
      console.log (`Word Index for "${this.name}" Created.\n`);
    }
    else{
      throw new Error ("File does not exist.");
    }

    //Add word index array to the collection using the name of the file
    this.collection[this.name] = this.wordIndex;
    return this.wordIndex;
  }

  //Function to return the jsonObject of the files
  getjsonObject(file) {
    //Check if argument is empty, if it so return last json object.
    if(typeof file === 'undefined') {
      return this.jsonCollection[this.jsonCollection.length - 1];
    }

    //Get index from argument and get json object
    this.jsonObject = this.jsonCollection[file];

    //Check if the json object with the name exists
    if(typeof this.jsonCollection[file] === 'undefined') {
      throw new Error(`Index Array for file "${file}" does not exist`);
    }
    if(this.jsonObject.length !== 0) {
      return this.jsonObject;
    }
    else{
      throw new Error("There is no Array of Indeces.");
    }
  }

  //Function to return word index of the files
  getIndex(file) {
    //Check if argument is empty, if it is, throw an error.
    if(typeof file === 'undefined') {
      throw new Error ("Please specify name of file.");
    }

    //Get index from argument and get the word index array
    this.wordIndex = this.collection[file];

    //Check if the word index with the name exists
    if(typeof this.collection[file] === 'undefined') {
      throw new Error(`Index Array for file "${file}" does not exist`);
    }
    if(this.wordIndex.length !== 0) {
      return this.wordIndex;
    }
    else{
      throw new Error("Location does not exist.");
    }
  }

  //Function to search through created word indices
  searchIndex(file, fullQuery, callback) {
    //Check if argument is empty, if it so return last word index array.
    if(typeof file === 'undefined') {
      this.wordIndex = this.collection[this.collection.length - 1];}

    //Retrieve the array index with the file name
    this.wordIndex = this.collection[file];

    if(typeof this.wordIndex === 'undefined') {
      return;}

    //Variable to hold result
    let indices = [];

    //Check if the query is a string, if so split the words into an array.
    if(typeof(fullQuery) === typeof("tolu")) {
      tokens  = fullQuery.split(" ");}

    //Check if the query is an array, if so, flatten into a 1 level array.
    else if(Array.isArray(fullQuery)) {
      tokens = flattenArray(fullQuery);}
    else{
      console.log("Invalid input type. Please try again.");
      return;
    }

    //Loop through the array
    for(let i = 0; i < tokens.length; i++) {
      let found = false;
      let query = tokens[i].toString().replace(/[^a-zA-Z 0-9]+/g,'');
      console.log(`Searching for "${query}"..... `);

      /*
      *Loop through the the word index array, compare words and add array of
      *indices from word index to the result array if found.
      */
      for(let j = 0; j< this.wordIndex.length;j++) {
        for(let item in this.wordIndex[j]) {
            if(item === query) {
              found = true;
              indices = this.wordIndex[j][item];
              if(this.wordIndex[j][item].length === 1) {
                console.log(`Found "${query}" in JSON object ${this.wordIndex[j][item]}\n`);
              }
              if(this.wordIndex[j][item].length > 1) {
                full = "";
                for(let k = 0; k < this.wordIndex[j][item].length; k++) {
                  if(k === this.wordIndex[j][item].length - 1) {
                    full += `and ${indices[k]}`;
                  }
                  else if(k === this.wordIndex[j][item].length - 2) {
                    full += `${indices[k]} `;
                  }
                  else {
                    full += `${indices[k]}, `;
                  }
                }
                console.log(`Found "${query}" in JSON objects ${full} \n`);
              }
            }
          }
        }

        if(!found) {
        console.log(`"${query}" was not found. \n`);}
      }

    //Return the array of inicies.
    callback(null, indices);
  }

  //Function to flatten multiple arrays into one array
  flattenArray(value) {
    if(Array.isArray(value)) {
      for(let q = 0; q < value.length; q++) {
        flattenArray(value[q]);
      }
    }
    else{
      tempSearch.push(value);
    }
    return tempSearch;
  }
}

module.exports = invIndexScript;
