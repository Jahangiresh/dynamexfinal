var coordinate = $('.contact__map').attr('data-coordinate').split(',')
var main_coordinate = $('.contact__map').attr('data-center-coordinate').split(',');
var lat = main_coordinate[0],
    lon = main_coordinate[1],
    map,marker,position=new google.maps.LatLng(lat,lon);

var locations = $.parseJSON($('.contact__map').attr('data-coordinate'));

function initMap() {
    var mapOptions = {
      zoom: 12,
      position: position,
      map: map,
      disableDefaultUI: false,
      zoomControl: true,
      scrollwheel: true,
      center: new google.maps.LatLng(locations[0][1],locations[0][2]),
      styles: [
        {
          "featureType": "water",
          "elementType": "geometry",
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
        },
        {
          "elementType": "labels.text.stroke",
        },
        {
          "elementType": "labels.text.fill",
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.fill",
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
        }
      ]
    };

    var mapElement = document.getElementById('map');

    map = new google.maps.Map(mapElement, mapOptions);



    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map,
        icon:"/images/marker.svg"
      });

      console.log(marker)

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
}

initMap();