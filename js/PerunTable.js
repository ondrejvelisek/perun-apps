/**
 * Creates a table which can easily visualize JSON data
 */
function PerunTable() {
    this.columns = [];  // required attr: type("button", "number"), title
    this.values = [];
    this.clicableRows = {isClicable : false, id:"", prefix:"row-"};
    /**
     * Returns a new instance of the table
     */
    /**
     * Adds a new column. Name is the name of JSON
     */
    this.addColumn = function(column) {
        this.columns.push(column);
    }
    this.setClicableRows = function(clicableRows) {
        this.clicableRows = clicableRows;
    }

    /**
     * Adds the array with values
     */
    this.setValues = function(values) {
        this.values = values;
    }
    this.setList = function(values) {
        for (var id in values) {
            this.values.push({ key: id, value: values[id] });
            
        }
    }

    /**
     * Draws the table and returns the HTML string
     */
    this.draw = function() {
        if (this.clicableRows.isClicable) {
            var html = "<table class=\"table table-bordered table-hover\">";
        } else {
            var html = "<table class=\"table table-bordered\">";
        }
        

        // draw headers
        html += "<thead><tr>";
        for (var i in this.columns) {
            var value = this.columns[i].title;
            html += "<th class='col-"+this.columns[i].type+"'>" + value + "</th>";
        }
        html += "</thead></tr>";
        html += "<tbody>";


        for (var row in this.values) {
            if (this.clicableRows.isClicable) {
                html += "<tr class='clicable' id='"+this.clicableRows.prefix+this.values[row][this.clicableRows.id]+"'>";
            } else {
                html += "<tr>";
            }
            
            for (var id in this.columns) {
                var column = this.columns[id];
                html += "<td class='col-"+column.type+"'>";
                switch (column.type) {
                    case "button":
                        html += (new TableButton(this.values[row][column.btnId], "tableBtn", column.btnText, column.btnType)).html();
                        break;
                    case "number":
                        html += (1+parseInt(row));
                        break;
                    case "boolean":
                        if (this.values[row][column.name] === true) {
                            html += "<i class='glyphicon glyphicon-ok'></i>";
                        } else if (this.values[row][column.name] === false) {
                            html += "<i class='glyphicon glyphicon-remove'></i>";
                        } else {
                            html += " ";
                        }
                        break;
                    case "icon":
                        if (!this.values[row][column.name]) {
                            html += " ";
                        } else {
                            html += "<i class='glyphicon "+this.values[row][column.name]+"' title='"+column.description+"' data-toggle='tooltip'></i>";
                        }
                        break;
                    default :
                        if (this.values.length == 0) {
                            break;
                        }
                        html += this.values[row][column.name];
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



function TableButton(id, name, title, type) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.type = type;

    this.html = function() {
        var html = '<button id="' + this.name+"-"+this.id + '" class="btn btn-'+this.type+'">' + this.title + '</button>';
        return html;
    };
}