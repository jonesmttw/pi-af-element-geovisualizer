let map: AFMap = new AFMap('l-map');
let conn: AFConnector;
let linechart;

$(() => {
    $('#modalConnect').modal('show');
});

function connectToAF(): void {
    let host: string = $('#txtServerUrl').val().toString();
    let username: string = $('#txtUsername').val().toString();
    let password: string = $('#txtPassword').val().toString();

    $('#valServerUrl, #valUsername, #valPassword').addClass('hide');

    if(!host || !username || !password) {
        if(!host) {
            $('#valServerUrl').removeClass('hide');
        }
        if(!username) {
            $('#valUsername').removeClass('hide');
        }
        if(!password) { 
            $('#valPassword').removeClass('hide');
        }
    } else {
        $(".modal-footer .btn-primary .fas").removeClass("hide");
        conn = new AFConnector(host, username, password);
        conn.getAssetServers();
    }
}