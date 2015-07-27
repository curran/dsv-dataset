var dsvDataset = require("./dsv-dataset.js");
var assert = require("assert");

describe("dsv-dataset", function () {

  var dsvStrings = {
  
    iris: [
      "sepal_length,sepal_width,petal_length,petal_width,class",
      "5.1,3.5,1.4,0.2,setosa",
      "4.9,3.0,1.4,0.2,setosa",
      "4.7,3.2,1.3,0.2,setosa",
      "6.2,2.9,4.3,1.3,versicolor",
      "5.1,2.5,3.0,1.1,versicolor",
      "5.7,2.8,4.1,1.3,versicolor",
      "6.3,3.3,6.0,2.5,virginica",
      "5.8,2.7,5.1,1.9,virginica",
      "7.1,3.0,5.9,2.1,virginica"
    ].join("\n"),

    temperature: [
      "timestamp,temperature",
      "2015-03-20T21:00:00.000Z,23.9516625615764",
      "2015-03-20T22:00:00.000Z,23.0728888291688",
      "2015-03-20T23:00:00.000Z,22.2708190476318",
      "2015-03-21T00:00:00.000Z,21.3394373423804",
      "2015-03-21T01:00:00.000Z,20.1010743049325",
      "2015-03-21T02:00:00.000Z,18.4150717551479",
      "2015-03-21T03:00:00.000Z,17.7483817583905",
      "2015-03-21T04:00:00.000Z,17.6589726749868",
      "2015-03-21T05:00:00.000Z,17.0922334804965"
    ].join("\n")

  }

  it("should parse to strings if types not specified", function() {
    var dsvString = dsvStrings.iris;
    var metadata = {
      delimiter: ","
    };

    var data = dsvDataset.parse(dsvString, metadata);

    assert.equal(data.length, dsvString.split("\n").length - 1);
    assert.equal(typeof data[0].sepal_length, "string");
  });

  it("should parse numeric columns", function() {
    var dsvString = dsvStrings.iris;
    var metadata = {
      delimiter: ",",
      columns: [
        { name: "sepal_length", type: "number" },
        { name: "sepal_width",  type: "number" },
        { name: "petal_length", type: "number" },
        { name: "petal_width",  type: "number" },
        { name: "class",        type: "string" }
      ]
    };

    var data = dsvDataset.parse(dsvString, metadata);

    assert.equal(data.length, dsvString.split("\n").length - 1);
    assert.equal(typeof data[0].sepal_length, "number");
    assert.equal(typeof data[0].sepal_width,  "number");
    assert.equal(typeof data[0].petal_length, "number");
    assert.equal(typeof data[0].petal_width,  "number");
    assert.equal(typeof data[0].class,        "string");
  });

  it("should parse date columns", function() {
    var dsvString = dsvStrings.temperature;
    var metadata = {
      delimiter: ",",
      columns: [
        { name: "timestamp", type: "date" },
        { name: "temperature", type: "number" }
      ]
    };

    var data = dsvDataset.parse(dsvString, metadata);

    assert.equal(data.length, dsvString.split("\n").length - 1);

    assert(data[0].timestamp instanceof Date);
    assert.equal(data[0].timestamp.getMonth(), 2);
    assert.equal(typeof data[0].temperature, "number");
  });
});
