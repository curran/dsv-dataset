var dsvDataset = require("./dsv-dataset.js");
var assert = require("assert");

describe("dsv-dataset", function () {

  var dsvString = [
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
  ].join("\n");

  it("should parse to strings if types not specified", function() {

    var metadata = {
      title: "Iris",
      delimiter: ","
    };

    var dataset = dsvDataset.parse(dsvString, metadata);

    assert.equal(dataset.data.length, dsvString.split("\n").length - 1);
    assert.equal(dataset.metadata, metadata);
    assert.equal(typeof dataset.data[0].sepal_length, "string");
  });

  it("should parse numeric columns", function() {

    var metadata = {
      title: "Iris",
      delimiter: ",",
      columns: {
        sepal_length: { type: "number" },
        sepal_width:  { type: "number" },
        petal_length: { type: "number" },
        petal_width:  { type: "number" },
        class:        { type: "string" }
      }
    };

    var dataset = dsvDataset.parse(dsvString, metadata);

    assert.equal(dataset.data.length, dsvString.split("\n").length - 1);
    assert.equal(dataset.metadata, metadata);

    assert.equal(typeof dataset.data[0].sepal_length, "number");
    assert.equal(typeof dataset.data[0].sepal_width,  "number");
    assert.equal(typeof dataset.data[0].petal_length, "number");
    assert.equal(typeof dataset.data[0].petal_width,  "number");
    assert.equal(typeof dataset.data[0].class,        "string");
  });
});
