class AFDatabase {
    constructor(connector, options) {
        this.afelements = [];
        this.getListHtml = () => {
            let afdatabase = this;
            return "<li id='" + afdatabase.webid + "' class='liDatabase hover'><a href='#'>" + afdatabase.name + "</a></li>";
        };
        this.getElements = () => {
            let afdatabase = this;
            $("#afDisplayLoading").removeClass("hide");
            $.ajax({
                url: afdatabase.afconnector.proxyUrl + "/" + afdatabase.links.elements,
                type: 'GET',
                beforeSend: afdatabase.afconnector.authBeforeSend
            }).done((data) => {
                afdatabase.afconnector.clearElementList();
                for (let i = 0; i < data["Items"].length; i++) {
                    let item = data["Items"][i];
                    let afelement = new AFElement(afdatabase.afconnector, {
                        webid: item["WebId"],
                        name: item["Name"],
                        hasChildren: item["HasChildren"],
                        links: {
                            attributes: item["Links"]["Attributes"],
                            recordedData: item["Links"]["RecordedData"]
                        }
                    });
                    afdatabase.afelements.push(afelement);
                    $("#elementsList").append(afelement.getListHtml());
                }
                // TODO
                // pop up something that says unable to find lat lng
                $(".liElement").click(function () {
                    let id = $(this).prop("id");
                    let element = afdatabase.getElementById(id);
                    if (element) {
                        element.visualize();
                    }
                });
                $("#afDisplayLoading").addClass("hide");
            });
        };
        this.getElementById = (id) => {
            let afdatabase = this;
            for (let i = 0; i < afdatabase.afelements.length; i++) {
                if (afdatabase.afelements[i].webid === id) {
                    return afdatabase.afelements[i];
                }
            }
            return null;
        };
        var afdatabase = this;
        afdatabase.afconnector = connector;
        afdatabase.webid = options.webid;
        afdatabase.name = options.name;
        afdatabase.description = options.description;
        afdatabase.links = options.links;
    }
}
