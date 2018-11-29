let map = new AFMap('l-map');
let conn;
let linechart;
$(() => {
    $('#modalConnect').modal('show');
});
function connectToAF() {
    let host = $('#txtServerUrl').val().toString();
    let username = $('#txtUsername').val().toString();
    let password = $('#txtPassword').val().toString();
    $('#valServerUrl, #valUsername, #valPassword').addClass('hide');
    if (!host || !username || !password) {
        if (!host) {
            $('#valServerUrl').removeClass('hide');
        }
        if (!username) {
            $('#valUsername').removeClass('hide');
        }
        if (!password) {
            $('#valPassword').removeClass('hide');
        }
    }
    else {
        conn = new AFConnector(host, username, password);
        $('#modalConnect').modal('hide');
        conn.getAssetServers();
    }
}
