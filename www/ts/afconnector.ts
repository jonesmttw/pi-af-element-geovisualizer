class AFConnector {
    proxyUrl: string = window.location.protocol + "//" + window.location.host + "/api/";
    serverUrl: string;
    username: string;
    password: string;
    databases: Array<AFDatabase> = [];

    constructor(serverUrl: string, username: string, password: string){
        let afconnector = this;

        // handle the cases where the server url could end in / or not
        afconnector.serverUrl = serverUrl.charAt(serverUrl.length - 1) === "/" ? serverUrl : serverUrl + "/";
        afconnector.username = username;
        afconnector.password = password;
    }

    getAuthHeader = (): string => {
        let afconnector = this;

        return "Basic " + window.btoa(afconnector.username + ":" + afconnector.password);
    }

    authBeforeSend = (xhr: JQueryXHR): void => {
        let afconnector = this;

        xhr.setRequestHeader("Authorization", afconnector.getAuthHeader());
    }

    getAssetServers = (): void => {
        let afconnector = this;

        $.ajax({
            url: afconnector.proxyUrl + "/" + afconnector.serverUrl + "assetservers",
            type: "GET",
            beforeSend: afconnector.authBeforeSend,
        }).done((data) => {
            let items: any = data["Items"];
            if(items.length) {
                let webid: string = items[0]["WebId"];
                afconnector.getDatabases(webid);
            } 
        }).fail((data) => {
            $("#alert-failed-connection").removeClass("hide");
            $(".modal-footer .btn-primary .fas").addClass("hide");
        });
    }

    // list the databases to connect to and begin working through hierarchy 
    getDatabases = (webid: string): void => {
        let afconnector = this;

        $('#modalConnect').modal('hide');
        $("#alert-failed-connection").addClass("hide");
        $("#afDisplay, #afDisplayLoading").removeClass("hide");
        $.ajax({
            url: afconnector.proxyUrl + "/" + afconnector.serverUrl + "assetservers/" + webid + "/assetdatabases",
            type: "GET",
            beforeSend: afconnector.authBeforeSend
        }).done((data) => {
            for(let i = 0; i < data["Items"].length; i++){
                let db = data["Items"][i];
                let afdb = new AFDatabase(afconnector, {
                    webid: db["WebId"],
                    name: db["Name"],
                    description: db["Description"],
                    links: { 
                        elements: db["Links"]["Elements"] 
                    }
                });
                afconnector.databases.push(afdb);

                $('#elementsList').append(afdb.getListHtml());
            }

            $("#afDisplayLoading").addClass("hide");
            afconnector.setListHandlers();
        });

        $("#btnBack").click(() => {
            $("#elementsList").html("");
            for(let i = 0; i < afconnector.databases.length; i++) {
                $("#elementsList").append(afconnector.databases[i].getListHtml());
            }

            $("#btnBack").addClass("hide");
            $("#afDisplayHeader").text("Select Database");
            afconnector.setListHandlers();
        });
    }

    private setListHandlers = (): void => {
        let afconnector = this;

        $(".liDatabase").click(function() {
            let id: string = $(this).prop("id");
            let db: AFDatabase = afconnector.getDatabaseById(id);
            if(db) {
                db.getElements();
                $("#btnBack").removeClass("hide");
                $("#afDisplayHeader").text("Graph Element");
            }
        });
    }

    getDatabaseById = (id: string): AFDatabase => {
        let afconnector = this;

        for(let i = 0; i < afconnector.databases.length; i++) {
            if(afconnector.databases[i].webid === id) {
                return afconnector.databases[i];    
            }
        }

        return null;
    }

    clearElementList = (): void => {
        $("#elementsList").html("");
    }
}