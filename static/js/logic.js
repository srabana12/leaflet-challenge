// Create the map centered around the United States
var map = L.map('map').setView([37.09, -95.71], 4);
// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Add our "streetmap" tile layer to the map.
streetmap.addTo(map);

// Perform an API call to the earthquake USGS information endpoint.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    data.features.forEach(function (feature) {
        var magnitude = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        var markerOptions = {
            radius: magnitude * 2,
            fillColor: getColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          };
          // Create the marker and add it to the map
          L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], markerOptions)
            .addTo(map)
            .bindPopup('Magnitude: ' + magnitude + '<br>Depth: ' + depth);
    });
   

});

function getColor(depth) {
    var colors = ['#a4f600', '#ddf402', '#f7db11', '#fdb82a', '#fca35e', '#ff5f65'];
    var depthRanges = [-10, 10, 30, 50, 70, 90, 110];
    for (var i = 0; i < depthRanges.length; i++) {
      if (depth < depthRanges[i]) {
        return colors[i];
      }
    }
    return colors[colors.length - 1];
  }
// Create a legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var depthRanges = [-10, 10, 30, 50, 70, 90, 110];
  var labels = [];

  // Generate the legend HTML
  div.innerHTML += '<h4>Depth</h4>';
  for (var i = 1; i < depthRanges.length; i++) {
    var color = getColor(depthRanges[i]);
    var prevColor = getColor(depthRanges[i - 1]);
    var rangeLabel = depthRanges[i - 1] + ' - ' + depthRanges[i];
    if(depthRanges[i - 1] == 90){
      labels.push('<i style="width: 10px;height: 10px;display: inline-block;background:' + color + '"></i> ' + rangeLabel);
    }else {
      labels.push('<i style="width: 10px;height: 10px;display: inline-block;background:' + prevColor + '"></i> ' + rangeLabel);
      }
  }
  div.innerHTML += labels.join('<br>');

  return div;
};
legend.addTo(map);