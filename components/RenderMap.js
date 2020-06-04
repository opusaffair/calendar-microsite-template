// We will use these things from the lib
// https://react-google-maps-api-docs.netlify.com/
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  Circle,
} from "@react-google-maps/api";
import { Button } from "@material-ui/core";
import { useState, Fragment, useEffect, useMemo } from "react";
import EventGridCard from "./EventGridCard";
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
    //in m
    dist = dist * 1609.344;
    return dist;
  }
}

function RenderMap({
  lib,
  location,
  results = [],
  setRadius,
  radius,
  setBoundingBox,
}) {
  // The things we need to track in state
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState(location);
  const [zoom, setZoom] = useState(12);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  //   // Load the Google maps scripts
  //   const { isLoaded } = useLoadScript({
  //     // Enter your own Google Maps API key
  //     googleMapsApiKey: "",
  //     libraries: lib,
  //   });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY, // ,
    libraries: lib,
    // ...otherOptions
  });
  if (loadError) console.log(loadError);
  // The places I want to create markers for.
  // This could be a data-driven prop.
  //   const myPlaces = [
  //     { id: "place1", pos: { lat: 39.09366509575983, lng: -94.58751660204751 } },
  //     { id: "place2", pos: { lat: 39.10894664788252, lng: -94.57926449532226 } },
  //     { id: "place3", pos: { lat: 39.07602397235644, lng: -94.5184089401211 } },
  //   ];

  // Iterate myPlaces to size, center, and zoom map to contain all markers
  // const fitBounds = map => {
  //   const bounds = new window.google.maps.LatLngBounds();
  //   myPlaces.map(place => {
  //     bounds.extend(place.pos);
  //     return place.id;
  //   });
  //   map.fitBounds(bounds);
  // };

  useEffect(() => {
    setCenter(location);
  }, [location]);

  const loadHandler = (map) => {
    // Store a reference to the google map instance in state
    setMapRef(map);
    // Fit map bounds to contain all markers
    // fitBounds(map);
  };

  // We have to create a mapping of our places to actual Marker objects
  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // Remember which place was clicked
    setSelectedPlace(place);

    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }
    setInfoOpen(true);
  };

  const handleMapMovement = useMemo(
    () =>
      throttle((map) => {
        logBounds(map);
      }, 500),
    []
  );

  const logBounds = (mapRef) => {
    if (mapRef) {
      var bounds = mapRef.getBounds();
      var center = mapRef.center;
      var ne = bounds.getNorthEast();

      var d = distance(location.lat, location.lng, ne.lat(), location.lng);
      setRadius(d);
    }
  };

  const handleRefocus = (mapRef) => {
    var bounds = mapRef.getBounds();
    var center = mapRef.center;
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    console.log(center);
    setBoundingBox({
      ne: { lat: ne.lat(), lng: ne.lng() },
      sw: { lat: sw.lat(), lng: sw.lng() },
    });
  };

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          // Do stuff on map initial laod
          onLoad={loadHandler}
          // Save the current center position in state
          // onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          // Save the user's map click position
          //   onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
          onBoundsChanged={() => {
            var bounds = mapRef.getBounds();
            var center = mapRef.center;
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
          }}
          onZoomChanged={() => handleMapMovement(mapRef)}
          center={center}
          zoom={zoom}
          options={{ disableDefaultUI: true, zoomControl: true }}
          mapContainerStyle={{
            height: 300,
            width: "100%",
          }}
        >
          {/* <Marker position={location} title={location.description} /> */}
          {/* <Circle
            // position={location}
            // onLoad={(c) => console.log("circle loaded", radius, location, c)}
            options={{
              strokeColor: "magenta",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FFFFFF",
              fillOpacity: 0.35,
              visible: true,
              radius: radius,
              center: location,
              zIndex: 1,
            }}
          /> */}

          {results.map((result) =>
            result.Venue.map((v) => {
              if (!v.location || !v.location.latitude || !v.location.longitude)
                return;
              return (
                <Marker
                  title={result.title}
                  key={`${result._id}-${v._id}`}
                  onLoad={(marker) =>
                    markerLoadHandler(marker, {
                      ...result,
                      id: `${result._id}-${v._id}`,
                    })
                  }
                  onClick={(event) =>
                    markerClickHandler(event, {
                      ...result,
                      id: `${result._id}-${v._id}`,
                    })
                  }
                  position={{
                    lat: v.location.latitude,
                    lng: v.location.longitude,
                  }}
                />
              );
            })
          )}
          {/* {myPlaces.map((place) => {
            return (
              <Marker
                key={place.id}
                position={place.pos}
                onLoad={(marker) => markerLoadHandler(marker, place)}
                onClick={(event) => markerClickHandler(event, place)}
                // Not required, but if you want a custom icon:
                icon={{
                  path:
                    "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                  fillColor: "#0000ff",
                  fillOpacity: 1.0,
                  strokeWeight: 0,
                  scale: 1.25,
                }}
              />
            );
          })} */}

          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div style={{ width: 250 }}>
                <EventGridCard event={selectedPlace} />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        <Button onClick={() => handleRefocus(mapRef)}>
          Refocus Search on Map
        </Button>
      </Fragment>
    );
  };

  return isLoaded ? renderMap() : null;
}

export default RenderMap;
