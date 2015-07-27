import { dsv } from "d3-dsv";

export default {
  parse: function (dsvString, metadata){
    var dataset = {};

    dataset.metadata = metadata;

    dataset.data = dsv(metadata.delimiter).parse(dsvString, function (d){
      return d;
    });

    return dataset;
  }
};
