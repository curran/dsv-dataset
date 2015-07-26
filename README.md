# dsv-dataset
  A metadata specification for data sets.
  
  One of the many recurring issues in data visualization is parsing data sets, which are frequently represented in a delimiter-separated value (DSV) format, such as comma-separated value (CSV) or tab-separated value (TSV). Conveniently, the [d3-dsv](https://github.com/d3/d3-dsv) project supports parsing such data sets. However, the resulting parsed data table has string values, and it is up to the developer to parse those string values into numbers or dates.
  
  The primary purpose of this project is to provide a way to annotate DSV data sets with type information about their columns, so they can be automatically parsed. Additionally, this project specifies how descriptive metadata can be added to data sets, such as human-readable titles and descriptions for data sets and columns. This metadata can be surfaced in visualizations to provide a nicer user experience. For example, the human-readable title for a column can be used as an axis label (e.g. "Sepal Width"), rather than the not-so-nice column name from the original DSV data (e.g. "sepal_width").
