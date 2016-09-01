var fs = require('fs');

//Function to create a word index array out of json files
exports.WordIndexFactory = function(){

  //Variable that contains the  current index's json form
  this.jsonForm =  {};

  //Variable that contains the current index's word index array
  this.wordIndex = [];

  ////Variable Array that contains the word index array of all files
  this.collection = {};

  //Variable that contains the json forms of all files
  this.jsonCollection = {};

  //Temporary variable to use to store the file names
  this.name = "";

  //Temporary array to store search results
  let tempSearch = [];

  //Variable for story array of words after splitting
  let tokens = [];

  //Temporary Variable to use for each word in the token array
  let temp = "";

  //Vaiable to check if word exists.
  let check = true;

  //Variable for temporary json objects
  let obj = {};

  //Variable string to use for search result
  let full = "";

  //Variable for combining strings in the json object
  let comboText = "";

  //Function to create the wordIndex from the file
  this.createIndex = function(filePath){
    var answer = typeof this.jsonForm === 'undefined' ? false : true;
    this.jsonForm = {};
    this.wordIndex = [];

    //Check if file exists
    if(fs.existsSync(filePath))
    {
      //Stores the name of the file and converst to json form
      this.name = filePath.split("/").pop();
      let content = fs.readFileSync(filePath);
      this.jsonForm = JSON.parse(content);

      //stores json object with the name
      this.jsonCollection[this.name] = this.jsonForm;

      for(let i = 0; i < this.jsonForm.length; i++)
      {
        if(typeof this.jsonForm[i].title != 'undefined' || typeof this.jsonForm[i].text != 'undefined')
        {
          //combine the strings in the object
          comboText = `${this.jsonForm[i].title.toString().toLowerCase()}
          ${this.jsonForm[i].text.toString().toLowerCase()}`;

          //Split all the words and put them into an array
          tokens = comboText.split(" ");
          for(let j = 0; j < tokens.length; j++)
          {
            temp = tokens[j].toString().replace(/[^a-zA-Z 0-9]+/g,'');
            check = true;
            //Check if it's the first iteration and put the first word
            if(i === 0 && j === 0)
            {
              obj = {};
              obj[temp] = [i];
              this.wordIndex.push(obj);
            }
            else
            {
              /*
              *Check if element exists and if it does, just add the index to the file else add
              *the word and the index.
              */
              for(let key of this.wordIndex)
              {
                for(let element in key)
                {
                  if(element === temp)
                  {
                    check = false;
                    if(key[element].toString().indexOf(i.toString()) === -1)
                    {
                      key[element].push(i);
                    }
                  }
                }
              }
              if(check)
              {
                obj = {};
                obj[temp] = [i];
                this.wordIndex.push(obj);
              }
            }
          }
        }
      }
      console.log(`Word Index for "${this.name}" Created.\n`)
    }
    else
    {
      console.log("File does not exist.\n");
    }

    //Add word index array to the collection using the name of the file
    this.collection[this.name] = this.wordIndex;
    return answer;
  };

  //Function to return the jsonForm of the files
  this.getJsonForm = function(file)
  {
    //Check if argument is empty, if it so return last json object.
    if(typeof file == 'undefined')
    return this.jsonCollection[this.jsonCollection.length - 1];

    //Get index from argument and get json object
    this.jsonForm = this.jsonCollection[file];

    //Check if the json object with the name exists
    if(typeof this.jsonCollection[file] == 'undefined')
    {
      console.log(`Index Array for file "${file}" does not exist`)
      return;
    }
    if(this.jsonForm.length !== 0)
    {
      return this.jsonForm;
    }
    else
    {
      console.log("There is no Array of Indeces.");
      return;
    }
  };

  //Function to return word index of the files
  this.getIndex = function(file)
  {
    //Check if argument is empty, if it so return last word index array.
    if(typeof file === 'undefined')
    return this.collection[this.collection.length - 1];

    //Get index from argument and get the word index array
    this.wordIndex = this.collection[file];

    //Check if the word index with the name exists
    if(typeof this.collection[file] === 'undefined')
    {
      console.log(`Index Array for file "${file}" does not exist`)
      return;
    }
    if(this.wordIndex.length !== 0)
    {
      return this.wordIndex;
    }
    else
    {
      console.log("There is no Array of Indeces.");
      return;
    }
  };

  //Function to search through created word indices
  this.searchIndex = function(file, fullQuery, callback)
  {
    //Check if argument is empty, if it so return last word index array.
    if(typeof file === 'undefined')
    this.wordIndex = this.collection[this.collection.length - 1];

    //Retrieve the array index with the file name
    this.wordIndex = this.collection[file];

    if(typeof this.wordIndex === 'undefined')
    return;

    //Variable to hold result
    let indices = [];

    //Check if the query is a string, if so split the words into an array.
    if(typeof(fullQuery) === typeof("tolu"))
    {tokens  = fullQuery.split(" ");}

    //Check if the query is an array, if so, flatten into a 1 level array.
    else if(Array.isArray(fullQuery))
    {tokens = flattenArray(fullQuery);}
    else
    {
      console.log("Invalid input type. Please try again.");
      return;
    }

    //Loop through the array
    for(let i = 0; i < tokens.length; i++)
    {
      let found = false;
      let query = tokens[i].toString().replace(/[^a-zA-Z 0-9]+/g,'');
      console.log(`Searching for "${query}"..... `);

      /*
      *Loop through the the word index array, compare words and add array of
      *indices from word index to the result array if found.
      */
      for(let j = 0; j< this.wordIndex.length;j++)
      {
        for(let item in this.wordIndex[j])
          {
            if(item === query)
            {
              found = true;
              indices = this.wordIndex[j][item];
              if(this.wordIndex[j][item].length === 1)
              {
                console.log(`Found "${query}" in JSON object ${this.wordIndex[j][item]}\n`);
              }
              if(this.wordIndex[j][item].length > 1)
              {
                full = "";
                for(let k = 0; k < this.wordIndex[j][item].length; k++)
                {
                  if(k === this.wordIndex[j][item].length - 1)
                  {
                    full += `and ${indices[k]}`;
                  }
                  else if(k === this.wordIndex[j][item].length - 2)
                  {
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

        if(!found)
        console.log(`"${query}" was not found. \n`);
      }

    //Return the array of inicies.
    callback(null, indices);
  };

  //Function to flatten multiple arrays into one array
  function flattenArray(value)
  {
    if(Array.isArray(value))
    {
      for(let q = 0; q < value.length; q++)
      {
        flattenArray(value[q]);
      }
    }
    else
    {
      tempSearch.push(value);
    }
    return tempSearch;
  };
}
