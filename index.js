import { dsv } from "d3-dsv";

var parseFunctions = {
  // implicitly: string: function (str){ return str; },
  number: parseFloat,
  date: function (str) {
    return new Date(str);
  }
};

function generateColumnParsers(metadata) {
  if("columns" in metadata){
    return metadata.columns
      .filter(function (column){
        return column.type !== "string";
      })
      .map(function (column){
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

    // Handle the case where `metadata` is not speficied.
    dataset.metadata = dataset.metadata || {};
    var metadata = dataset.metadata;

    // Handle the case where `metadata.columns` is not speficied.
    metadata.columns = metadata.columns || [];

    var columnParsers = generateColumnParsers(metadata);
    var numColumns = columnParsers.length;

    var data;
    if(dataset.data){
      data = dataset.data;
    } else {
      // Default to CSV if no delimiter speficied.
      data = dsv(metadata.delimiter || ",")
        .parse(dataset.dsvString);
    }

    dataset.data = data.map(function (d){

      // Old school for loop as an optimization.
      for(var i = 0; i < numColumns; i++){

        // Each column parser function mutates the row object,
        // replacing the column property string with its parsed variant.
        columnParsers[i](d);
      }
      return d;
    });

    // Add column descriptors for string columns with no descriptors in the schema.
    var columnsInMetadata = {};
    metadata.columns.forEach(function (column){
      columnsInMetadata[column.name] = true;
    });
    if(dataset.data.length > 0){
      Object.keys(dataset.data[0]).forEach(function (columnName){
        if(!columnsInMetadata[columnName]){
          metadata.columns.push({
            name: columnName,
            type: "string"
          });
        }
      });
    }

    return dataset;
  }
};
