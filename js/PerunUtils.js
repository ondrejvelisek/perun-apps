/**
 * Method which calls Perun RPC interface
 * Arguments:
 * manager - name of the manager, e.g. vosManager
 * method - name of the method, e.g. getVos
 * variable - name of the javascript variable which will be filled with the results
 * arguments which will be passed to the managers method
 * done - method which is started
 */
function callPerun(manager, method, args, callBack) {

    $.ajax({
        url: configuration.RPC_URL + manager + "/" + method,
        data: args,
        dataType: "jsonp",
        type: "get",
        success: function(data, textStatus, jqXHR)
        {
            if (!data) {
                (new Message(manager + " " + method, "hasn't returned data", "warning")).draw();
                callBack();
            } else if (typeof data.errorId !== "undefined") {
                (new Message(data.name, data.message, "error")).draw();
            } else {
                callBack(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            (new Message(errorThrown, textStatus, "error")).draw();
        }
    });
}
;


function callPerunPost(manager, method, args, callBack) {

    $.ajax({
        url: configuration.RPC_URL + manager + "/" + method,
        data: JSON.stringify(args),
        dataType: "jsonp",
        contentType: "application/json; charset=utf-8",
        type: "post",
        success: function(data, textStatus, jqXHR)
        {
            if (!data) {
                callBack();
            } else if (typeof data.errorId !== "undefined") {
                (new Message(data.name, data.message, "error")).draw();
            } else {
                callBack(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            (new Message(errorThrown, textStatus, "error")).draw();
        }
    });
}
;

/**
 * Method which calls Perun RPC interface
 * Arguments:
 * manager - name of the manager, e.g. vosManager
 * method - name of the method, e.g. getVos
 * elementId - name of the HTML element which will be filled with returned data
 * attribute - name of the attribute from which the data will be loaded in the HTML element, e.g. user.firstName
 * arguments which will be passed to the managers method
 */
function callPerunAndFillText(manager, method, elementId, attribute, args) {
    return $.ajax({
        url: configuration.RPC_URL + manager + "/" + method,
        data: args,
        success: function(data, textStatus, jqXHR)
        {
            if (typeof data.errorId !== "undefined")
            {
                alert(data.errorText);
            } else {
                eval('$("#' + elementId + '")').text(eval("data." + attribute));
            }
        },
        dataType: "jsonp",
        type: "get"
    });
}
;

/**
 * Get URL parameter
 */
function getURLParameter(name) {
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
}


$(document).ready(function() {
    //care of tabs address in url.
    var url = document.location.toString();
    if (url.match('#')) {
        $('#menu a[href=#' + url.split('#')[1] + ']').tab('show');
    }
    $('#menu a').on('shown.bs.tab', function(e) {
        window.location.hash = e.target.hash;
        window.scrollTo(0, 0);
    });
    
    //tooltip activate
    $('[data-toggle="tooltip"]').tooltip();
});



function debug(obj) {
    alert(JSON.stringify(obj));
}