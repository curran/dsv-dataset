var dsvDataset = require("./dsv-dataset.js");
var assert = require("assert");
var ChiasmDataset = require("chiasm-dataset");
var csv = require("d3-dsv").csv;

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

    irisWithQuotes: [
      '"class","petal_length","petal_width","sepal_length","sepal_width"',
      '"setosa","1.4","0.2","5.1","3.5"',
      '"setosa","1.4","0.2","4.9","3.0"',
      '"setosa","1.3","0.2","4.7","3.2"',
      '"setosa","1.5","0.2","4.6","3.1"',
      '"setosa","1.4","0.2","5.0","3.6"',
      '"setosa","1.7","0.4","5.4","3.9"',
      '"setosa","1.4","0.3","4.6","3.4"',
      '"setosa","1.4","0.2","4.4","2.9"',
      '"setosa","1.5","0.1","4.9","3.1"',
      '"setosa","1.4","0.1","4.8","3.0"'
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

  it("should parse to strings if types not specified", function(done) {

    var dataset = dsvDataset.parse({
      dsvString: dsvStrings.iris,
      metadata: {
        delimiter: ","
      }
    });

    assert.equal(dataset.data.length, dsvStrings.iris.split("\n").length - 1);
    assert.equal(typeof dataset.data[0].sepal_length, "string");

    ChiasmDataset.validate(dataset).then(done, console.log);
  });

  it("should parse numeric columns", function(done) {

    var dataset = dsvDataset.parse({
      dsvString: dsvStrings.iris,
      metadata: {
        delimiter: ",",
        columns: [
          { name: "sepal_length", type: "number" },
          { name: "sepal_width",  type: "number" },
          { name: "petal_length", type: "number" },
          { name: "petal_width",  type: "number" },
          { name: "class",        type: "string" }
        ]
      }
    });

    var row = dataset.data[0];

    assert.equal(dataset.data.length, dsvStrings.iris.split("\n").length - 1);
    assert.equal(typeof row.sepal_length, "number");
    assert.equal(typeof row.sepal_width,  "number");
    assert.equal(typeof row.petal_length, "number");
    assert.equal(typeof row.petal_width,  "number");
    assert.equal(typeof row.class,        "string");

    ChiasmDataset.validate(dataset).then(done, console.log);
  });

  it("should parse numeric columns with quotes", function(done) {

    var dataset = dsvDataset.parse({
      dsvString: dsvStrings.irisWithQuotes,
      metadata: {
        delimiter: ",",
        columns: [
          { name: "sepal_length", type: "number" },
          { name: "sepal_width",  type: "number" },
          { name: "petal_length", type: "number" },
          { name: "petal_width",  type: "number" },
          { name: "class",        type: "string" }
        ]
      }
    });

    var row = dataset.data[0];

    assert.equal(dataset.data.length, dsvStrings.irisWithQuotes.split("\n").length - 1);
    assert.equal(typeof row.sepal_length, "number");
    assert.equal(typeof row.sepal_width,  "number");
    assert.equal(typeof row.petal_length, "number");
    assert.equal(typeof row.petal_width,  "number");
    assert.equal(typeof row.class,        "string");

    ChiasmDataset.validate(dataset).then(done, console.log);
  });

  it("should parse date columns", function(done) {

    var dataset = dsvDataset.parse({
      dsvString: dsvStrings.temperature,
      metadata: {
        delimiter: ",",
        columns: [
          { name: "timestamp", type: "date" },
          { name: "temperature", type: "number" }
        ]
      }
    });

    assert.equal(dataset.data.length, dsvStrings.temperature.split("\n").length - 1);

    assert(dataset.data[0].timestamp instanceof Date);
    assert.equal(dataset.data[0].timestamp.getMonth(), 2);
    assert.equal(typeof dataset.data[0].temperature, "number");

    ChiasmDataset.validate(dataset).then(done, console.log);
  });

  it("should assume CSV if no delimiter specified", function(done) {
    var dataset = dsvDataset.parse({
      dsvString: dsvStrings.iris,
      metadata: {}
    });

    assert.equal(dataset.data.length, dsvStrings.iris.split("\n").length - 1);
    assert.equal(typeof dataset.data[0].sepal_length, "string");

    ChiasmDataset.validate(dataset).then(done, console.log);
  });

  it("should work if no metadata argument provided", function(done) {
    var dataset = dsvDataset.parse({
      dsvString: dsvStrings.iris
    });

    assert.equal(dataset.data.length, dsvStrings.iris.split("\n").length - 1);
    assert.equal(typeof dataset.data[0].sepal_length, "string");

    ChiasmDataset.validate(dataset).then(done, console.log);
  });

  it("should accept 'data' argument instead of 'dsvString'", function(done) {

    var dataset = dsvDataset.parse({
      data: csv.parse(dsvStrings.iris),
      metadata: {
        delimiter: ",",
        columns: [
          { name: "sepal_length", type: "number" },
          { name: "sepal_width",  type: "number" },
          { name: "petal_length", type: "number" },
          { name: "petal_width",  type: "number" },
          { name: "class",        type: "string" }
        ]
      }
    });

    var row = dataset.data[0];

    assert.equal(dataset.data.length, dsvStrings.iris.split("\n").length - 1);
    assert.equal(typeof row.sepal_length, "number");
    assert.equal(typeof row.sepal_width,  "number");
    assert.equal(typeof row.petal_length, "number");
    assert.equal(typeof row.petal_width,  "number");
    assert.equal(typeof row.class,        "string");

    ChiasmDataset.validate(dataset).then(done, console.log);
  });
});
