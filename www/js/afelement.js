class AFElement {
    constructor(connector, options) {
        this.attributes = [];
        this.chardata = [];
        this.getAttributes = () => {
            let afelement = this;
            $.ajax({
                url: afelement.afconnector.proxyUrl + "/" + afelement.links.attributes,
                type: 'GET',
                beforeSend: afelement.afconnector.authBeforeSend
            }).done((data) => {
                for (let i = 0; i < data["Items"].length; i++) {
                    let item = data["Items"][i];
                    let afattribute = new AFAttribute(afelement.afconnector, afelement, {
                        webid: item["WebId"],
                        name: item["Name"],
                        unittype: item["Type"],
                        links: {
                            currentvalue: item["Links"]["Value"]
                        }
                    });
                    afelement.attributes.push(afattribute);
                }
            });
        };
        this.getListHtml = () => {
            let afelement = this;
            return "<li id='" + afelement.webid + "' class='list-group-item list-group-item-action hover liElement'><a href='#'>" + afelement.name + "<i class='fas fa-globe-americas hide'></i></a></li>";
        };
        this.visualize = () => {
            let afelement = this;
            $("#chartLoading").removeClass("hide");
            afelement.drawChart();
        };
        this.drawChart = () => {
            let afelement = this;
            $("#chartAFData").removeClass("hide");
            $.ajax({
                url: afelement.afconnector.proxyUrl + "/" + afelement.links.recordedData,
                type: 'GET',
                beforeSend: afelement.afconnector.authBeforeSend
            }).done((data) => {
                let items = data["Items"];
                for (let i = 0; i < items.length; i++) {
                    let item = data["Items"][i];
                    let chartData = afelement.recordedPointToChartJs(item["Items"]);
                    afelement.chardata.push({
                        label: item["Name"],
                        data: chartData,
                        backgroundColor: afelement.getRandomColor()
                    });
                }
                linechart = new Chart(document.getElementById("canvasChart").getContext("2d"), {
                    type: 'line',
                    data: {
                        datasets: afelement.chardata
                    },
                    options: {
                        title: {
                            display: true,
                            text: afelement.name + " Attribute Data"
                        }
                    }
                });
                $("#chartLoading").addClass("hide");
            });
        };
        this.recordedPointToChartJs = (items) => {
            let arr = [];
            for (let i = 0; i < items.length; i++) {
                arr.push({
                    x: new Date(items[i]["Timestamp"]),
                    y: items[i]["Value"]
                });
            }
            return arr;
        };
        this.getRandomColor = () => {
            let letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        // not all attributes are ready when the lat lng are ready
        this.generatePopupInfo = () => {
            let afelement = this;
            let table = "<h5>" + afelement.name + " Current Values</h5><table>";
            for (let i = 0; i < afelement.attributes.length; i++) {
                let attribute = afelement.attributes[i];
                table += "<tr><td>" + attribute.name + "</td><td>" + attribute.currentValue + " " + attribute.unitdisplay + "</td></tr>";
            }
            table += "</table>";
            return table;
        };
        this.geoReady = (lat, lng) => {
            let afelement = this;
            if (lat) {
                afelement.lat = lat;
            }
            if (lng) {
                afelement.lng = lng;
            }
            if (afelement.lat && afelement.lng) {
                afelement.lmarker = map.setPoint(afelement.lat, afelement.lng, afelement.generatePopupInfo());
                $("#" + afelement.webid + ", .fas").removeClass("hide");
            }
        };
        this.updatePopupInfo = () => {
            let afelement = this;
            afelement.lmarker.setPopupContent(afelement.generatePopupInfo());
        };
        let afelement = this;
        afelement.afconnector = connector;
        afelement.webid = options.webid;
        afelement.name = options.name;
        afelement.hasChildren = options.hasChildren;
        afelement.links = options.links;
        afelement.getAttributes();
    }
}
