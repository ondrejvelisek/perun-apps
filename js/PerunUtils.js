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
                (flowMessager.newMessage(manager + " " + method, "hasn't returned data", "warning")).draw();
                callBack();
            } else if (typeof data.errorId !== "undefined") {
                (flowMessager.newMessage(data.name, data.message, "danger")).draw();
            } else {
                callBack(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            (flowMessager.newMessage(errorThrown, textStatus, "danger")).draw();
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
                (flowMessager.newMessage(data.name, data.message, "danger")).draw();
            } else {
                callBack(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            (flowMessager.newMessage(errorThrown, textStatus, "danger")).draw();
        }
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
    var hash = document.location.hash.substring(1);
    if (hash.length > 0) {
        $('#menu a[href=#' + hash + ']').tab('show');
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