
$(document).ready(function() {
    if (configuration.TESTING_CONNECTION) {
        // Methods which check if the Perun connection is OK
        setTimeout(executeQuery, 5000);
    }
});


function reloadMsg() {
    alert("Data connection lost. Click OK to relad the page.");
    window.location.reload();
}


function executeQuery() {
        $.ajax({
            url: configuration.TEST_RPC_URL,
            success: function(data) {
                if (!(data.myString.indexOf("OK!") == 0)) {
                    reloadMsg();
                }
                setTimeout(executeQuery, 5000);
            },
            statusCode: {
                404: function() {
                    reloadMsg();
                },
                401: function() {
                    reloadMsg();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reloadMsg();
            }
        });
}