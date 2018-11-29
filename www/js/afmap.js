class AFMap {
    constructor(divid) {
        this.setPoint = (lat, lng, popupinfo) => {
            let afmap = this;
            let point = new L.Marker([lat, lng]);
            point.bindPopup(popupinfo);
            point.addTo(afmap.map);
        };
        let afmap = this;
        afmap.map = L.map(divid).setView([37.634, -101.049], 5);
        let osmLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 4, attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors' });
        afmap.map.addLayer(osmLayer);
    }
}
