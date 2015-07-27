import { dsv } from "d3-dsv";

var parseFunctions = {
  number: function (str) {
    return +str;
  }
};

function generateColumnParsers(metadata) {

  var columnParsers = [];

  if("columns" in metadata){
    columnParsers = Object.keys(metadata.columns)

      // Extract the array of column metadata objects.
      .map(function (columnName){
        var column = metadata.columns[columnName];
        column.name = columnName;
        return column;
      })

      // Do not generate column parsing functions for string columns,
      // because they are already strings and need no modification.
      .filter(function (column){
        return column.type !== "string";
      })

      .map(function (column){
        var parseValue = parseFunctions[column.type];
        var columnName = column.name;
        return function (d){
          d[columnName] = parseValue(d[columnName]);
        }
      });
  }
  return columnParsers;
}

export default {
  parse: function (dsvString, metadata){
    var dataset = {};
    var columnParsers = generateColumnParsers(metadata);

    var numColumns = columnParsers.length;
    var i;
    dataset.data = dsv(metadata.delimiter).parse(dsvString, function (d){
      for(i = 0; i < numColumns; i++){
        columnParsers[i](d);
      }
      return d;
    });

    dataset.metadata = metadata;

    return dataset;
  }
};
