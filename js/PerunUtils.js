/**
 * Method which calls Perun RPC interface
 * Arguments:
 * manager - name of the manager, e.g. vosManager
 * method - name of the method, e.g. getVos
 * variable - name of the javascript variable which will be filled with the results
 * arguments which will be passed to the managers method
 * done - method which is started
 */
function callPerun(manager, method, args) {

    return function(callBack) {
        $.ajax({
            url: configuration.RPC_URL + manager + "/" + method,
            data: args,
            success: function(data, textStatus, jqXHR)
            {
                if (typeof data.errorId !== "undefined")
                {
                    alert(data.errorText);
                } else {
                    callBack(data);
                }
            },
            dataType: "jsonp",
            type: "get"
        });
    }


};


/**
 * Method which calls Perun RPC interface in sync mode with POST
 * Arguments: similar to callPerun()
 */
function callPerunSyncPost(manager, method, variable, args) {
    return $.ajax({
        async: false,
        url: configuration.RPC_URL + manager + "/" + method,
        data: JSON.stringify(args),
        success: function(data, textStatus, jqXHR)
        {
            if (typeof data.errorId !== "undefined")
            {
                alert(data.errorText);
            }
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        type: "post"
    });
}
;
function callPerunPost(manager, method, args) {

    return function(callBack) {
        $.ajax({
            url: configuration.RPC_URL + manager + "/" + method,
            data: JSON.stringify(args),
            success: function(data, textStatus, jqXHR)
            {
                if (typeof data.errorId !== "undefined")
                {
                    alert(data.errorText);
                } else {
                    callBack(data);
                }
            },
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            type: "post"
        });
    }
    
};

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
