# dsv-dataset
  A metadata specification and parsing library for data sets.
  
  One of the many recurring issues in data visualization is parsing data sets, which are frequently represented in a delimiter-separated value (DSV) format, such as comma-separated value (CSV) or tab-separated value (TSV). Conveniently, the [d3-dsv](https://github.com/d3/d3-dsv) project supports parsing such data sets. However, the resulting parsed data table has string values, and it is up to the developer to parse those string values into numbers or dates.
  
  The primary purpose of this project is to provide a way to annotate DSV data sets with type information about their columns, so they can be automatically parsed. Additionally, this project specifies how descriptive metadata can be added to data sets, such as human-readable titles and descriptions for data sets and columns. This metadata can be surfaced in visualizations to provide a nicer user experience. For example, the human-readable title for a column can be used as an axis label (e.g. "Sepal Width"), rather than the not-so-nice column name from the original DSV data (e.g. "sepal_width").

## Usage
Require the library via NPM:

```javascript
var dsvDataset = require("dsv-dataset");
```

Here is an example program that parses three columns from the [Iris dataset](https://archive.ics.uci.edu/ml/datasets/Iris).

```javascript
// This string contains CSV data that could be loaded from a .csv file.
var dsvString = [
  "sepal_length,sepal_width,petal_length,petal_width,class",
  "5.1,3.5,1.4,0.2,setosa",
  "6.2,2.9,4.3,1.3,versicolor",
  "6.3,3.3,6.0,2.5,virginica"
].join("\n");

// This metadata specifies the delimiter and column types.
var metadata = {
  delimiter: ",",
  columns: {
    sepal_length: { type: "number" },
    sepal_width:  { type: "number" },
    petal_length: { type: "number" },
    petal_width:  { type: "number" },
    class:        { type: "string" }
  }
};

// Use dsv-dataset to parse the data.
var data = dsvDataset.parse(dsvString, metadata);

// Pretty-print the parsed data table as JSON.
console.log(JSON.stringify(data, null, 2));
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

## Metadata Specification

The metadata for a data set is a JavaScript object with the following properties.

 * `title` (string) A human readable name for the data set.
 * `description` (string - Markdown, optional) A human readable free text description of the data set. This can be Markdown, so can include links. The length of this should be about one paragraph.
 * `sourceURL` (string - URL, optional) The URL from which the data set was originally downloaded.
 * `delimiter` (string - single character) The delimiter used between values. Typical values are `,` (CSV), `\t` (TSV), and `|`.
 * `columns` (array of objects) An array of column descriptor objects.

Each entry in the `columns` array is a column descriptor object with the following properties.

 * `name` (String) The column name found on the first line of the DSV data set.
 * `type` (String - one of `"string"`, `"number"` or `"date"`) The type of this column. If the type is specified as `"date"`, then [moment(String)](http://momentjs.com/docs/#/parsing/string/) will be used to parse the date. If no type is specified, the default is "string".
 * `title` (string, optional) A human readable name for the column. Should be a single word or as few words as possible. Intended for use on axis labels and column selection UI widgets.
 * `description` (string - Markdown, optional) A human readable free text description of the data set. This can be Markdown, so can include links. The length of this should be about one sentence, and should communicate the meaning of the column to the user. Intended for use in tooltips when hovering over axes in a visualization.

## API

<a name="parse" href="#parse">#</a> <i>dsvDataset</i>.<b>parse</b>(<i>dsvString</i>, <i>metadata</i>)

Parses the given DSV string using the given metadata. Returns the parsed data table as an array of row objects. The argument `metadata` has the structure described above.

