import { dsv } from "d3-dsv";
import moment from "moment";

var parseFunctions = {
  number: parseFloat,
  date: function (str) {
    return moment(str).toDate();
  }
};

function generateColumnParsers(metadata) {

  var columnParsers = [];

  if("columns" in metadata){
    columnParsers = metadata.columns

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
    
    return dsv(metadata.delimiter).parse(dsvString, function (d){
      for(i = 0; i < numColumns; i++){
        columnParsers[i](d);
      }
      return d;
    });
  }
};
