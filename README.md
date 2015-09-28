# dsv-dataset

[![Build Status](https://travis-ci.org/curran/dsv-dataset.svg)](https://travis-ci.org/curran/dsv-dataset)

A metadata specification and parsing library for data sets.

One of the many recurring issues in data visualization is parsing data sets. Data sets are frequently represented in a delimiter-separated value (DSV) format, such as [comma-separated value (CSV)](https://en.wikipedia.org/wiki/Comma-separated_values) or tab-separated value (TSV). Conveniently, the [d3-dsv](https://github.com/d3/d3-dsv) library supports parsing such data sets. However, the resulting parsed data table has string values for every column, and it is up to the developer to parse those string values into numbers or dates, depending on the data.

**The primary purpose of this library is to provide a way to annotate DSV data sets with type information about their columns, so they can be automatically parsed.** This enables developers to shift the logic of how to parse columns out of visualization code, and into a separate metadata specification.

## Installation

Install via NPM: `npm install dsv-dataset`

Require the library via Node.js / Browserify:

```javascript
var dsvDataset = require("dsv-dataset");
```

You can also require the library via Bower: `bower install dsv-dataset`. The file `bower_components/dsv-dataset/dsv-dataset.js` contains a [UMD](https://github.com/umdjs/umd) bundle, which can be included via a `<script>` tag, or using [RequireJS](http://requirejs.org/).

## Example

Here is an example program that parses three columns from the [Iris dataset](https://archive.ics.uci.edu/ml/datasets/Iris).

```javascript

// Use dsv-dataset to parse the data.
var dataset = dsvDataset.parse({
  // This string contains CSV data that could be loaded from a .csv file.
  dsvString: [
    "sepal_length,sepal_width,petal_length,petal_width,class",
    "5.1,3.5,1.4,0.2,setosa",
    "6.2,2.9,4.3,1.3,versicolor",
    "6.3,3.3,6.0,2.5,virginica"
  ].join("\n"),

  // This metadata object specifies the delimiter and column types.
  // This could be loaded from a .json file.
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

// Pretty-print the parsed data table as JSON.
console.log(JSON.stringify(dataset.data, null, 2));
```
The following JSON will be printed:
```json
[
  {
    "sepal_length": 5.1,
    "sepal_width": 3.5,
    "petal_length": 1.4,
    "petal_width": 0.2,
    "class": "setosa"
  },
  {
    "sepal_length": 6.2,
    "sepal_width": 2.9,
    "petal_length": 4.3,
    "petal_width": 1.3,
    "class": "versicolor"
  },
  {
    "sepal_length": 6.3,
    "sepal_width": 3.3,
    "petal_length": 6,
    "petal_width": 2.5,
    "class": "virginica"
  }
]
```
Notice how numeric columns have been parsed to numbers.

## API

<a name="parse" href="#parse">#</a> <i>dsvDataset</i>.<b>parse</b>(<i>dataset</i>)

Parses the given DSV dataset, which is comprised of a DSV string and a metadata specification. This function mutates the <i>dataset</i> argument by adding a `data` property, which contains the parsed data table (an array of row objects). Returns the mutated <i>dataset</i> object.

Argument structure:

<i>dataset</i> (object) The dataset representation, with properties

* `dsvString` (string) The data table represented in DSV format, parsed by [d3-dsv](https://github.com/d3/d3-dsv).
* `metadata` (object, optional) Annotates the data table with metadata, with properties
    * `delimiter` (string, optional) The delimiter used between values. Typical values are
        * `","` (CSV) This is the default used if no delimiter is specified.
        * `"\t"` (TSV)
        * `"|"`
    * `columns` (array of objects) An array of column descriptor objects with properties
        * `name` (String) The column name found on the first line of the DSV data set.
        * `type` (String - one of `"string"`, `"number"` or `"date"`) The type of this column.
            * If `type` is `"number"`, then [`parseFloat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) will parse the string.
            * If `type` is `"date"`, then [new Date(String)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) will parse the string.
            * If no type is specified, the default is "string".

## Project Structure

This project uses [NPM](https://www.npmjs.com/) as the primary build tool. The file `package.json` specifies that this project depends on [d3-dsv](https://github.com/d3/d3-dsv).

The main source file is `index.js`. This exposes the top-level `dsvDataset` module using [ES6 Module Syntax](https://github.com/lukehoban/es6features#modules). This file is transformed into `dsv-dataset.js` by [Rollup](https://github.com/rollup/rollup), which outputs a [UMD](https://github.com/umdjs/umd) bundle. Note that since `d3-dsv` exposes ES6 modules via the `jsnext:main` field in its `package.json`, Rollup includes the necessary modules directly in the `dsv-dataset.js` bundle. Unit tests live in `test.js`. These tests run against the built file, `dsv-dataset.js`.

To build `dsv-dataset.js` from `index.js` and run unit tests, run the command

```
npm test
```

This will execute both the `pretest` and `test` scripts specified in `package.json`. The `pretest` script builds the bundle, and the `test` script runs the unit tests using [Mocha](http://mochajs.org/).

The development flow for me is 1.) edit code and save 2.) run `npm test`.

## Future Plans


A future goal of this project is to provide recommentations for how descriptive metadata can be added to data sets. This includes human-readable titles and descriptions for data sets and columns. This metadata can be surfaced in visualizations to provide a nicer user experience. For example, the human-readable title for a column can be used as an axis label (e.g. "Sepal Width"), rather than the not-so-nice column name from the original DSV data (e.g. "sepal_width").

The `metadata` object will have the following optional properties:

 * `title` (string) A human readable name for the data set.
 * `description` (string - Markdown) A human readable free text description of the data set. This can be Markdown, so can include links. The length of this should be about one paragraph.
 * `sourceURL` (string - URL) The URL from which the data set was originally downloaded.

Each entry in the `columns` array will have the following optional properties:

 * `title` (string) A human readable name for the column. Should be a single word or as few words as possible. Intended for use on axis labels and column selection UI widgets.
 * `description` (string - Markdown) A human readable free text description of the data set. This can be Markdown, so can include links. The length of this should be about one sentence, and should communicate the meaning of the column to the user. Intended for use in tooltips when hovering over axes in a visualization, and for entries in user interfaces for selecting columns (e.g. dropdown menu or drag & drop column list).

DSV data sets could have incrementally more useful and powerful "levels" of metadata annotation. These levels might look something like this:

 * Level 0 - There is an intention to publish the data set.
 * Level 1 - The data set is published in some form other than DSV.
 * Level 2 - The data set is published on the Web as a valid DSV string.
 * Level 3 - Metadata that includes the delimiter and type of each column is published.
 * Level 4 - The data set is given a title, description, and source URL.
 * Level 5 - All columns have a title.
 * Level 6 - All columns have a description.
 
Related work

 * [Common Core Metadata Schema v1.0](https://project-open-data.cio.gov/schema/)
 * [Dublin Core "Levels of interoperability"](http://dublincore.org/metadata-basics/)
 * [Five Stars of Linked Data](http://www.w3.org/DesignIssues/LinkedData.html#fivestar)
