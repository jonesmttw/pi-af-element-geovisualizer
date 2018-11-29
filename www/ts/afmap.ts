class AFMap {
    map: L.Map;

    constructor(divid: string){
        let afmap = this;

        afmap.map = L.map(divid).setView([37.634, -101.049], 5);
        let osmLayer: L.TileLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { minZoom: 4, attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'});

        afmap.map.addLayer(osmLayer);
    }

    setPoint = (lat: number, lng: number, popupinfo: string): void => {
        let afmap = this;

        let point = new L.Marker([lat, lng]);
        point.bindPopup(popupinfo);
        point.addTo(afmap.map);
    }
}