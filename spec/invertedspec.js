var invIndex = require('../inverted-index.js');
var inv = new invIndex.Index();
var file = "movies.json";
var jsonData = [];
var jsonForm = {};

describe("Read Book Data ", function(){
  it("should not be empty.", function(){
    var check = inv.createIndex("jasmine/books.json");
    inv.createIndex("jasmine/movies.json");
    expect(check).toBe(true);
  });
});

describe("GetIndex ", function(){
  it("should not be undefined.", function(){
    jsonData = inv.getIndex(file);
    //console.log(jsonData);
    expect(jsonData).toBeDefined();
    expect(jsonData.length).toBeDefined();
    expect(jsonData.length).not.toBe(0);
    for(var t = 0; t < jsonData.length; t++)
    {
      expect(Object.keys(jsonData[0]).length).toBeGreaterThan(0);
      break;
    }
  });
});

/*inv.loadJSON(function(err, data)
{
  var jsonData = data;
  var indexArray = [];
  describe("Read book data ", function(){
    it("should not be empty.", function(){
      //console.log(jsonData.length);
      expect(data).toBeDefined();
      expect(data.length).not.toBe(0);
      //console.log(data.toString());
      for(var t = 0; t < data.length; t++)
      {
        expect(Object.keys(data[0]).length).toBeGreaterThan(0);
        break;
      }
    });
  });*/

  describe("Populate Index ", function(){
    it("should have index.", function(){
      jsonForm = inv.getJsonForm(file);
      expect(jsonForm).toBeDefined();
      expect(jsonForm.length).toBeGreaterThan(0);
      //console.log(jsonData);
      for(var i = 0; i < jsonData.length; i++)
      {
        //console.log(jsonForm[i].title.toString());
        expect(jsonData[i].toString()).toBeDefined();
        expect(jsonData[i].toString().length).toBeGreaterThan(0);
      }
      for(var item in jsonData[0])
        {
          var index = jsonData[0][item];
          var comboText = jsonForm[index[0]].title.toString().toLowerCase() + " " + jsonForm[index[0]].text.toString().toLowerCase();
          expect(comboText.indexOf(item)).not.toEqual(-1);
        }
    });
  });

  describe("Search Array ", function(){
    it("should return array of indices.", function(){
      var fullQuery = "wonder glaxy is 2";
      var tokens  = fullQuery.split(" ");
      jsonForm = inv.getJsonForm(file);
      for(var j = 0; j < tokens.length; j++)
      {
        var query = tokens[j].toString().replace(/[^a-zA-Z 0-9]+/g,'');

        inv.searchIndex(file, query, function(err, dataIndex){
          //console.log(dataIndex.toString());
          expect(jsonData).toBeDefined();
          //console.log(dataIndex[0]);
            for(var i = 0; i < dataIndex.length; i++)
            {
              var tempIndex = dataIndex[i];
              for(var item in jsonData[tempIndex])
              {
                var index = jsonData[tempIndex][item];
                //console.log(index[0] + " : " + item);
                var comboText = jsonForm[index[0]].title.toString().toLowerCase() + " " + jsonForm[index[0]].text.toString().toLowerCase();
                expect(comboText.indexOf(query)).toBeDefined();
              }
            }
        });
      }
    });
  });
//});
