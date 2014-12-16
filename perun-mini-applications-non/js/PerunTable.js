/**
 * Creates a table which can easily visualize JSON data
 */
function PerunTable() {
    this.columns = [];  // required attr: type("button", "number"), title
    this.values = [];
    this.type = "";
    /**
     * Returns a new instance of the table
     */
    /**
     * Adds a new column. Name is the name of JSON
     */
    this.addColumn = function (column) {
        this.columns.push(column);
    }

    /**
     * Adds the array with values
     */
    this.setValues = function (values) {
        this.values = values;
    }
    this.setList = function (values) {
        for (var id in values) {
            this.values.push({key: id, value: values[id]});

        }
    }

    /**
     * Draws the table and returns the HTML string
     */
    this.draw = function () {

        var html = "<table class=\"table table-bordered\">";

        // draw headers
        html += "<thead><tr>";
        for (var i in this.columns) {
            var value = this.columns[i].title;
            html += "<th class='col-" + this.columns[i].type + "'>" + value + "</th>";
        }
        html += "</thead></tr>";
        html += "<tbody>";


        for (var row in this.values) {
            html += "<tr>";
            for (var id in this.columns) {
                var column = this.columns[id];
                html += "<td class='col-" + column.type + "'>";
                switch (column.type) {
                    case "button":
                        html += (new TableButton(this.values[row][column.btnId], column.btnName, column.btnText, column.btnType)).html();
                        break;
                    case "number":
                        html += (1 + parseInt(row));
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
                            html += "";
                        } else {
                            html += "<i class='glyphicon " + this.values[row][column.name] + "' title='" + column.description + "' data-toggle='tooltip'></i>";
                            //need active tooltip after table will be draw -- table.find('[data-toggle="tooltip"]').tooltip();
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
    }
}
;



function TableButton(id, name, title, type) {
    this.id = id;
    this.name = name;
    this.title = title;
    this.type = type;

    this.html = function () {
        var html = '<button id="' + this.name + "-" + this.id + '" class="btn btn-' + this.type + '">' + this.title + '</button>';
        return html;
    };
}