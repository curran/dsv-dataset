import { dsv } from "d3-dsv";
import moment from "moment";

var parseFunctions = {
  number: parseFloat,
  date: function (str) {
    return moment(str).toDate();
  }
};

function generateColumnParsers(metadata) {
  if("columns" in metadata){
    return metadata.columns

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
  } else {
    return [];
  }
}

export default {
  parse: function (dataset){

    var dsvString = dataset.dsvString;

    // Handle the case where `metadata` is not speficied.
    var metadata = dataset.metadata || {};

    // Default to CSV if no delimiter speficied.
    var delimiter = metadata.delimiter || ",";

    var columnParsers = generateColumnParsers(metadata);
    var numColumns = columnParsers.length;
    var i;

    dataset.data = dsv(delimiter).parse(dsvString, function (d){

      // Old school for loop as an optimization.
      for(i = 0; i < numColumns; i++){

        // Each column parser function mutates the row object,
        // replacing the column property string with its parsed variant.
        columnParsers[i](d);
      }
      return d;
    });

    return dataset;
  }
};
