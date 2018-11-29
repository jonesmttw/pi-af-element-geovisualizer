class AFAttribute {
    constructor(connector, element, options) {
        let afattribute = this;
        afattribute.afconnector = connector;
        afattribute.afelement = element;
        afattribute.webid = options.webid;
        afattribute.name = options.name;
        afattribute.unittype = options.unittype;
        afattribute.links = options.links;
        afattribute.isLatitude = options.name.toLowerCase() === "lat" || options.name.toLowerCase() === "latitude";
        afattribute.isLongitude = options.name.toLowerCase() === "lng" || options.name.toLowerCase() === "longitude";
        // need to make this into a promise because the value is not there yet
        $.ajax({
            url: afattribute.afconnector.proxyUrl + "/" + afattribute.links.currentvalue,
            type: 'GET',
            beforeSend: afattribute.afconnector.authBeforeSend
        }).done((data) => {
            afattribute.currentValue = data["Value"];
            afattribute.unitdisplay = data["UnitsAbbreviation"];
            if (afattribute.afelement.lmarker) {
                afattribute.afelement.updatePopupInfo();
            }
            if (afattribute.isLatitude) {
                afattribute.afelement.geoReady(afattribute.currentValue, null);
            }
            if (afattribute.isLongitude) {
                afattribute.afelement.geoReady(null, afattribute.currentValue);
            }
        });
    }
}
