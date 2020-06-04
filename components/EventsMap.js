import React, { useMemo, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";
import throttle from "lodash/throttle";

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
    //    dist =  dist * 1609.344;
    //This isn't a standard unit. It's an approximation for the display
    return dist * 800;
  }
}

const EventsMap = React.memo(function Map({
  location,
  results = [],
  setRadius,
  inputRef: ref,
  map,
  google,
}) {
  let markers = [];
  //   const { ref, map, google } = useGoogleMaps(
  //     `${process.env.GOOGLE_API_KEY}&libraries=places`,
  //     {
  //       zoom: 12,
  //       center: location,
  //       disableDefaultUI: true,
  //       zoomControl: true,
  //     }
  //   );

  useEffect(() => {
    if (map) {
      map.setCenter(location);
    }
  }, [location]);

  useEffect(() => {
    console.log("results changed", results, markers);
    deleteMarkers();
    markResults();
  }, [results]);

  function addMarker(loc) {
    if (map) {
      var marker = new google.maps.Marker({
        position: loc,
        map: map,
      });
      markers.push(marker);
    }
  }

  function markResults() {
    console.log("marking results");
    results.forEach((marker) => {
      if (marker.Venue) {
        marker.Venue.forEach((venue) => {
          const l = venue.location;
          addMarker({ ...marker, lat: l.latitude, lng: l.longitude });
        });
      }
    });
    console.log("markers", markers);
  }

  function deleteMarkers() {
    console.log("del");
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
        deleteMarkers();
        var bounds = map.getBounds();
        var center = map.center;
        var ne = bounds.getNorthEast();
        setRadius(distance(center.lat(), center.lng(), ne.lat(), ne.lng()));
      }, 500),
    []
  );

  if (map) {
    google.maps.event.addListener(map, "bounds_changed", function () {
      call(map);
    });
  }

  return (
    <>
      <div ref={ref} style={{ height: 300 }} />
      <button onClick={deleteMarkers}>del</button>
    </>
  );
});
export default EventsMap;
