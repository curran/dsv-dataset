import { dsv } from "d3-dsv";
import moment from "moment";

var parseFunctions = {
  string: function (str){ return str; },
  number: parseFloat,
  date: function (str) {
    return moment(str).toDate();
  }
};

function generateColumnParsers(metadata) {
  if("columns" in metadata){
    return metadata.columns.map(function (column){
      var parse = parseFunctions[column.type];
      var name = column.name;
      return function (d){
        d[name] = parse(d[name]);
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

    dataset.data = dsv(delimiter).parse(dsvString, function (d){

      // Old school for loop as an optimization.
      for(var i = 0; i < numColumns; i++){

        // Each column parser function mutates the row object,
        // replacing the column property string with its parsed variant.
        columnParsers[i](d);
      }
      return d;
    });

    return dataset;
  }
};
