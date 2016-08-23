var multi = require('../multi.js');

describe("multiplication", function(){
  it("should multiply 2 and 3", function(){
    var product = multi.multiply(2, 3);
    expect(product).toBe(6);
  });

  it("contains spec with an expectation", function(){
    expect(true).toBe(true);
  });
});
