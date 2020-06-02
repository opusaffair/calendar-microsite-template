import React, { useMemo, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";
import throttle from "lodash/throttle";
// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map
const uluru = { lat: -25.344, lng: 131.036 };
const rando = { lat: -25.444, lng: 131.036 };

function distance(lat1, lon1, lat2, lon2) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    //dist in meters
    return dist * 1609.344;
  }
}

const EventsMap = React.memo(function Map({
  location,
  results = [],
  setRadius,
}) {
  let markers = [];
  const { ref, map, google } = useGoogleMaps(
    `${process.env.GOOGLE_API_KEY}&libraries=places`,
    {
      zoom: 12,
      center: location,
      disableDefaultUI: true,
      zoomControl: true,
    }
  );

  useEffect(() => {
    if (map) {
      map.setCenter(location);
      // deleteMarkers();
      // addMarker(location);
    }
  }, [location]);

  useEffect(() => {
    console.log(results);
    // markers = [...results, location];
    resetMarkers();
  }, [results]);

  function addMarker(loc) {
    if (google) {
      var marker = new google.maps.Marker({
        position: loc,
        map: map,
      });
      markers.push(marker);
    }
  }

  function resetMarkers() {
    deleteMarkers();
    markers = [...results, location];
    markers.forEach((marker) => {
      if (marker.Venue) {
        marker.Venue.forEach((venue) => {
          const l = venue.location;
          addMarker({ ...marker, lat: l.latitude, lng: l.longitude });
        });
      }
    });
  }

  function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
  }

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  const call = useMemo(
    () =>
      throttle((map) => {
        var bounds = map.getBounds();
        var center = map.center;
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();
        console.log(
          "moved map",
          center,
          distance(center.lat(), center.lng(), ne.lat(), ne.lng(), "K")
        );
        setRadius(distance(center.lat(), center.lng(), ne.lat(), ne.lng()));
      }, 500),
    []
  );

  if (map) {
    // new google.maps.Marker({ position: uluru, map });
    // new google.maps.Marker({ position: location, map });
    google.maps.event.addListener(map, "bounds_changed", function () {
      // var bounds = map.getBounds();
      // var ne = bounds.getNorthEast();
      // var sw = bounds.getSouthWest();
      // console.log(distance(ne.lat(), ne.lng(), sw.lat(), sw.lng(), "K"));

      call(map);
    });
  }

  return <div ref={ref} style={{ height: 300 }} />;
});
export default EventsMap;
