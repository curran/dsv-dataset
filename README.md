# dsv-dataset
  A metadata specification for data sets.
  
  One of the many recurring issues in data visualization is parsing data sets, which are frequently represented in a delimiter-separated value (DSV) format, such as comma-separated value (CSV) or tab-separated value (TSV). Conveniently, the [d3-dsv](https://github.com/d3/d3-dsv) project supports parsing such data sets. However, the resulting parsed data table has string values, and it is up to the developer to parse those string values into numbers or dates.
  
  The primary purpose of this project is to provide a way to annotate DSV data sets with type information about their columns, so they can be automatically parsed. Additionally, this project specifies how descriptive metadata can be added to data sets, such as human-readable titles and descriptions for data sets and columns. This metadata can be surfaced in visualizations to provide a nicer user experience. For example, the human-readable title for a column can be used as an axis label (e.g. "Sepal Width"), rather than the not-so-nice column name from the original DSV data (e.g. "sepal_width").

# Dataset Metadata Specification

The metadata for a data set is a JSON object literal with the following properties.

 * `title` (string) A human readable name for the data set.
 * `description` (string - Markdown, optional) A human readable free text description of the data set. This can be Markdown, so can include links. The length of this should be about one paragraph.
 * `sourceURL` (string - URL, optional) The URL from which the data set was originally downloaded.
 * `delimiter` (string - single character) The delimiter used between values. Typical values are `,` (CSV), `\t` (TSV), and `|`.
 * `columns` (array of objects) An array of column descriptor objects.

Each entry in the `columns` array is a column descriptor object with the following properties.

 * `name` (String) The column name found on the first line of the DSV data set.
 * `type` (String - one of `"string"`, `"number"` or `"date"`) The type of this column. If the type is specified as `"date"`, then [moment(String)](http://momentjs.com/docs/#/parsing/string/) will be used to parse the date.
 * `title` (string, optional) A human readable name for the column. Should be a single word or as few words as possible. Intended for use on axis labels and column selection UI widgets.
 * `description` (string - Markdown, optional) A human readable free text description of the data set. This can be Markdown, so can include links. The length of this should be about one sentence, and should communicate the meaning of the column to the user. Intended for use in tooltips when hovering over axes in a visualization.

# API

...

`title` If left unspecified, `name` will be used in place of `title`.
