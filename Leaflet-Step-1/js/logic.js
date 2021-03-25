var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";


d3.json(url, function(data) {
  createFeatures(data.features)
});

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function radiusSize(magnitude) {
    return magnitude * 20000;
  }
  
  function circleColor(magnitude) {
    switch (true) {
      case magnitude < 5:
        return "#ff6633";
      case magnitude < 4:
        return "#ff9933";
      case magnitude < 3:
        return "#ffcc33";
      case magnitude < 2:
        return "#ffff33";
      case magnitude < 1:
        return "#ccff33";
      default:
        return "#2c99ea";
    }
  }

  function mapRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {

  var myMap = L.map("map", {
      center: [40.7608, -111.8910],
      zoom: 4
    });

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  }).addTo(myMap);
}