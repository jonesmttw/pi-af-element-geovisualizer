class AFConnector {
    constructor(serverUrl, username, password) {
        this.proxyUrl = window.location.protocol + "//" + window.location.host + "/api/";
        this.databases = [];
        this.getAuthHeader = () => {
            let afconnector = this;
            return "Basic " + window.btoa(afconnector.username + ":" + afconnector.password);
        };
        this.authBeforeSend = (xhr) => {
            let afconnector = this;
            xhr.setRequestHeader("Authorization", afconnector.getAuthHeader());
        };
        this.getAssetServers = () => {
            let afconnector = this;
            $("#afDisplay").removeClass("hide");
            $.ajax({
                url: afconnector.proxyUrl + "/" + afconnector.serverUrl + "assetservers",
                type: "GET",
                beforeSend: afconnector.authBeforeSend,
            }).done((data) => {
                let items = data["Items"];
                if (items.length) {
                    let webid = items[0]["WebId"];
                    afconnector.getDatabases(webid);
                }
                else {
                    //error
                }
            });
        };
        // list the databases to connect to and begin working through hierarchy 
        this.getDatabases = (webid) => {
            let afconnector = this;
            $("#afDisplayLoading").removeClass("hide");
            $.ajax({
                url: afconnector.proxyUrl + "/" + afconnector.serverUrl + "assetservers/" + webid + "/assetdatabases",
                type: "GET",
                beforeSend: afconnector.authBeforeSend
            }).done((data) => {
                for (let i = 0; i < data["Items"].length; i++) {
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
                for (let i = 0; i < afconnector.databases.length; i++) {
                    $("#elementsList").append(afconnector.databases[i].getListHtml());
                }
                $("#btnBack").addClass("hide");
                $("#afDisplayHeader").text("Select Database");
                afconnector.setListHandlers();
            });
        };
        this.setListHandlers = () => {
            let afconnector = this;
            $(".liDatabase").click(function () {
                let id = $(this).prop("id");
                let db = afconnector.getDatabaseById(id);
                if (db) {
                    db.getElements();
                    $("#btnBack").removeClass("hide");
                    $("#afDisplayHeader").text("Graph Element");
                }
            });
        };
        this.getDatabaseById = (id) => {
            let afconnector = this;
            for (let i = 0; i < afconnector.databases.length; i++) {
                if (afconnector.databases[i].webid === id) {
                    return afconnector.databases[i];
                }
            }
            return null;
        };
        this.clearElementList = () => {
            $("#elementsList").html("");
        };
        let afconnector = this;
        // handle the cases where the server url could end in / or not
        afconnector.serverUrl = serverUrl.charAt(serverUrl.length - 1) === "/" ? serverUrl : serverUrl + "/";
        afconnector.username = username;
        afconnector.password = password;
    }
}
