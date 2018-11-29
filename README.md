# PI AF Element Geovisualizer

My final project for the PI Web API course. Purpose is to allow users to connect to any PI Server, and then map any AF Elements that have a latitude and longitude attribute.  In addition to mapping the elements, you can also graph the recorded values for selected AF Elements.

To run the app (after an npm install): 
```
npm start
```

Any elements containing the following attributes will be added to the map upon selecting the AF Database (not case sensitive):
* Latitude
* Lat
* Longitude
* Lng

Selecting an AF Element will pull up the graph for the recorded values for that element. The graph is using ChartJS so you can toggle certain attributes to alter the graph after its been loaded.

Right now, you are only able to map elements at the root of the AF database - this is something I can continue to work on.

Dependencies:
* [NodeJS](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Leaflet](https://leafletjs.com/)
* [Chart.js](https://www.chartjs.org/)
* [Bootstrap](https://getbootstrap.com/)
* [jQuery](https://jquery.com/)