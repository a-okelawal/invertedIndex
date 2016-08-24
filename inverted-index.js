var fs = require('fs');

exports.Index = function(){
  this.jsonForm =  {};
  this.wordIndex = [];
  this.collection = {};
  this.jsonCollection = {};
  this.name = "";
  var tempSearch = [];

  this.createIndex = function(filePath){
    var answer = true;
    this.jsonForm = {};
    this.wordIndex = [];
    if(fs.existsSync(filePath))
    {
      this.name = filePath.split("/").pop();
      var content = fs.readFileSync(filePath);
      this.jsonForm = JSON.parse(content);
      this.jsonCollection[this.name] = this.jsonForm;
      if(this.jsonForm == undefined)
        answer = false;
      else
      {
        for(var i = 0; i < this.jsonForm.length; i++)
        {
          //console.log(jsonForm[i].title);
          if(this.jsonForm[i].title != undefined || this.jsonForm[i].text != undefined)
          {
            var comboText = this.jsonForm[i].title.toString().toLowerCase() + " " + this.jsonForm[i].text.toString().toLowerCase();
            //console.log(comboText);

            var tokens = comboText.split(" ");
            for(var j = 0; j < tokens.length; j++)
            {
              var temp = tokens[j].toString().replace(/[^a-zA-Z 0-9]+/g,'');
              var check = true;
              //console.log(temp);
              if(i == 0 && j == 0)
              {
                var obj = {};
                obj[temp] = [i];
                this.wordIndex.push(obj);
                //console.log(temp + " - " + i);
              }
              else
              {
                for(var key of this.wordIndex)
                {
                  //console.log(key.toString());
                  for(var element in key)
                  {
                    //console.log(temp + " - " + element);
                    if(element == temp)
                    {
                      check = false;
                      if(key[element].toString().indexOf(i.toString()) == -1)
                      {
                        //console.log(key[element].toString().indexOf(i.toString()));
                        key[element].push(i);
                        //console.log(key[element].toString());
                      }
                    }
                  }
                }
                if(check == true)
                {
                  //console.log(temp + " - " + wordIndex[i][temp]);
                  var obj = {};
                  obj[temp] = [i];
                  this.wordIndex.push(obj);
                } //end of if(check == true)
              } //end of else
            } //end of j for
          } //end of title and body check
        } //end of i for
        console.log("Word Index for " + this.name +" Created.\n")
      } //end of else
    } //end of file check
    else
    {
      console.log("File does not exist.\n");
      answer = false;
    }
    this.collection[this.name] = this.wordIndex;

    //console.log(this.collection);

    return answer;
  };

/*
  this.loadJSON = function(callback){
    var content = fs.readFileSync("jasmine/books.json");
    var jsonForm = JSON.parse(content);
    callback(null, jsonForm);
  };*/

  this.getJsonForm = function(file){
    this.jsonForm = this.jsonCollection[file];
    if(this.jsonCollection[file] == undefined)
    {
      console.log("Index Array for file \""+ file + "\" does not exist")
      return undefined;
    }
    if(this.jsonForm.length != 0)
    {
      return this.jsonForm;
    }
    else
    {
      console.log("There is no Array of Indeces.");
      return undefined;
    }
  };

  this.getIndex = function(file)
  {
    this.wordIndex = this.collection[file];
    if(this.collection[file] == undefined)
    {
      console.log("Index Array for file \""+ file + "\" does not exist")
      return undefined;
    }
    if(this.wordIndex.length != 0)
    {
      return this.wordIndex;
    }
    else
    {
      console.log("There is no Array of Indeces.");
      return undefined;
    }
    //console.log(this.collection[file]);
  };

  this.searchIndex = function(file, fullQuery, callback)
  {
    this.wordIndex = this.collection[file];
    var indices = [];
    var found = false;
    console.log(fullQuery);
    if(typeof(fullQuery) === typeof("tolu"))
    {var tokens  = fullQuery.split(" ");}
    else if(Array.isArray(fullQuery))
    {
      var tokens = convertArray(fullQuery);
      //console.log(tokens);
    }
    else
    {
      console.log("Invalid input type. Please try again.");
      return undefined;
    }
    for(var i = 0; i < tokens.length; i++)
    {
      var query = tokens[i].toString().replace(/[^a-zA-Z 0-9]+/g,'');
      console.log("Searching for \"" + query + "\"..... ");

      for(var j = 0; j< this.wordIndex.length;j++)
      {
        for(var item in this.wordIndex[j])
          {
            if(item == query)
            {
              found = true;
              indices = this.wordIndex[j][item];
              //console.log(indices);
              //console.log(indices[1]);
              if(this.wordIndex[j][item].length == 1)
              {
                console.log("Found \"" + query + "\" in JSON object " + this.wordIndex[j][item] + "\n");
              }
              if(this.wordIndex[j][item].length > 1)
              {
                var full = "";
                for(var k = 0; k < this.wordIndex[j][item].length; k++)
                {
                  if(k == this.wordIndex[j][item].length - 1)
                  {
                    full += "and " + indices[k];
                  }
                  else if(k == this.wordIndex[j][item].length - 2)
                  {
                    full += indices[k] + " ";
                  }
                  else {
                    full += indices[k] + ", ";
                  }
                }
                console.log("Found \"" + query + "\" in JSON objects " + full + "\n");
              }
            }
          }
        }

        if(found == false)
        console.log("\"" + query + "\" was not found. \n");
      }
    callback(null, indices);
  };

  function convertArray(value)
  {
    //console.log("This is " + value.toString());
    //console.log(Array.isArray("Talker"));
    if(Array.isArray(value))
    {
      //console.log(value.length);
      for(var q = 0; q < value.length; q++)
      {
        //console.log("Still entered " + value);
        convertArray(value[q]);
      }
    }
    else
    {
      tempSearch.push(value);
    }
    return tempSearch;
  };
}
