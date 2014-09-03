/**
 * Creates a table which can easily visualize JSON data
 */
function PerunTable() {
    this.columnNames = [];
    this.columnTitles = [];
    this.columnType = [];  // "text" (default), "button", "number"
    this.values = [];
    this.type = "";
    /**
     * Returns a new instance of the table
     */
    /**
     * Adds a new column. Name is the name of JSON
     */
    this.addColumn = function(name, title, type) {
        this.columnNames.push(name);
        this.columnTitles.push(title);
        this.columnType.push(type);
    }
    /**
     * Adds the array with values
     */
    this.setValues = function(values) {
        this.values = values;
    }
    this.setList = function(values) {
        for (var id in values) {
            this.values.push({ value : values[id] });
        }
    }

    /**
     * Draws the table and returns the HTML string
     */
    this.draw = function() {

        var html = "<table class=\"table table-bordered\">";

        // draw headers
        html += "<thead><tr>";
        for (var i in this.columnTitles) {
            var value = this.columnTitles[i];
            html += "    <th>" + value + "</th>";
        }
        html += "</thead></tr>";
        html += "<tbody>";


        for (var row in this.values) {
            html += "<tr>";
            for (var column in this.columnNames) {
                html += "<td>";
                switch (this.columnType[column]) {
                    case "button":
                        html += (new TableButton(row, "tableBtn", this.columnNames[column])).html();
                        break;
                    case "number":
                        html += (1+parseInt(row));
                        break;
                    default :
                        if (this.values.length == 0) {
                            break;
                        }
                        html += this.values[row][this.columnNames[column]];
                        break;
                }
                html += "</td>";
            }
            html += "</tr>";
        }
        html += "</tbody></table>";
        return html;



        /*
        if (this.type == "list") {
            for (var n in this.columnNames) {
                var colName = this.columnNames[n];
                for (var i in this.values[colName]) {
                    var rowHtml = "<tr>";
                    rowHtml += "    <td>" + this.values[colName][i] + "</td>";
                    rowHtml += "</tr>";
                    html += rowHtml;
                }
            }
        } else if (this.type == "array") {
            for (var n in this.columnNames) {
                var colName = this.columnNames[n];
                var colNameParts = colName.split(".");
                for (var i in this.values[colNameParts[0]]) {
                    var rowHtml = "<tr>";

                    rowHtml += "    <td>" + i + "</td>";
                    rowHtml += "    <td>" + this.values[colNameParts[0]][i] + "</td>";

                    rowHtml += "</tr>";
                    html += rowHtml;
                }
            }
        } else if (this.type == "listOfObjects") {
            for (var i in this.values) {
                var rowHtml = "<tr>";
                for (var n in this.columnNames) {
                    var colName = this.columnNames[n];
                    var obj = this.values[i];
                    rowHtml += "    <td>" + eval("obj." + colName) + "</td>";
                }
                rowHtml += "</tr>";
                html += rowHtml;
            }
        } else {
            // draw values
            for (var i in this.values) {

                var row = this.values[i];

                var rowHtml = "<tr>";

                for (var n in this.columnNames) {

                    var colName = this.columnNames[n];
                    var colNameParts = colName.split(".");
                    var value = "";
                    value = row;

                    for (var o in colNameParts) {
                        var localName = colNameParts[o];
                        if (value != null && typeof value[localName] != 'undefined') {
                            value = value[localName];
                            rowHtml += "    <td>" + value + "</td>";
                        }
                    }


                }
                rowHtml += "</tr>";

                html += rowHtml;
            }
        }
        html += "</tbody></table>";



        return html;
        */
    }


}
;



function TableButton(id, name, title) {
    this.id = id;
    this.name = name;
    this.title = title;

    this.html = function() {
        var html = '<button id="' + this.name+"-"+this.id + '" class="btn btn-danger pull-right">' + this.title + '</button>';
        return html;
    };
}