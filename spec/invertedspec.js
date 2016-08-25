var invIndexScript = require('../inverted-index.js');
var fs = require('fs');
var invObject = new invIndexScript.WordIndexFactory();
var fullFilePath = "jasmine/movies.json";
var file = fullFilePath.split("/").pop();
var jsonData = [];
var jsonForm = {};

describe("Read Book Data ", function(){
  it("should not be empty.", function(){
    invObject.createIndex(fullFilePath);
    let check = invObject.createIndex("jasmine/books.json");
    let tempJsonArray = invObject.getJsonForm("books.json");
    expect(check).toBe(true);
    for(let tempObj in tempJsonArray)
    {
      //console.log(tempObj);
      //console.log(tempJsonArray[tempObj]);
      expect(typeof(tempJsonArray[tempObj].title)).toBe(typeof("title"));
      expect(typeof(tempJsonArray[tempObj].text)).toBe(typeof("title"));
    }
  });
});

describe("GetIndex", function(){
  it(" ensure argument returns index location.", function(){
    expect(invObject.getIndex("books.json")).toBeDefined();
    expect(invObject.getIndex("books.json")).not.toBe(invObject.getIndex("movies.json"));
  });
});

  describe("Populate Index ", function(){
    it("should return index array.", function(){
      jsonData = invObject.getIndex(file);
      //console.log(jsonData);
      expect(jsonData).toBeDefined();
      expect(jsonData.length).toBeDefined();
      expect(jsonData.length).not.toBe(0);
      for(let t = 0; t < jsonData.length; t++)
      {
        expect(Object.keys(jsonData[0]).length).toBeGreaterThan(0);
        break;
      }
    });

    it("should ensure index is correct.", function(){
      jsonForm = invObject.getJsonForm(file);
      expect(jsonForm).toBeDefined();
      expect(jsonForm.length).toBeGreaterThan(0);
      //console.log(jsonData);
      for(let i = 0; i < jsonData.length; i++)
      {
        //console.log(jsonForm[i].title.toString());
        expect(jsonData[i].toString()).toBeDefined();
        expect(jsonData[i].toString().length).toBeGreaterThan(0);
      }
      for(let item in jsonData[0])
        {
          let index = jsonData[0][item];
          let comboText = jsonForm[index[0]].title.toString().toLowerCase() + " " + jsonForm[index[0]].text.toString().toLowerCase();
          expect(comboText.indexOf(item)).not.toEqual(-1);
        }
    });

    it("should ensure index is not overwritten.", function(){
      //invObject.createIndex("jasmine/books.json");
      //invObject.createIndex("jasmine/movies.json");
      expect(invObject.getIndex("books.json")).toBeDefined();
      expect(invObject.getIndex("movies.json")).toBeDefined();

    });
  });

  describe("Search Array ", function(){
    it("should return array of indices.", function(){
      //let fullQuery = [[["create", "talk"], ["wonder" , "galaxy"]] , ["the" , "2"]];
      let fullQuery = "wonder kid strange";
      jsonForm = invObject.getJsonForm(file);
        invObject.searchIndex(file, fullQuery, function(err, dataIndex){
          //console.log(dataIndex.toString());
          expect(jsonData).toBeDefined();
          //console.log(dataIndex[0]);
            for(let i = 0; i < dataIndex.length; i++)
            {
              let tempIndex = dataIndex[i];
              for(let item in jsonData[tempIndex])
              {
                let index = jsonData[tempIndex][item];
                //console.log(index[0] + " : " + item);
                let comboText = jsonForm[index[0]].title.toString().toLowerCase() + " " + jsonForm[index[0]].text.toString().toLowerCase();
                expect(comboText.indexOf(fullQuery)).toBeDefined();
              }
            }
        });
    });
  });
//});
