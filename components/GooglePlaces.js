import { useState, useRef, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }
  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null, details: null };

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function Auto({ errorMessage, setLocation, location, index }) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const loaded = useRef(false);
  const key = process.env.GOOGLE_API_KEY;
  const value = location;
  const [options, setOptions] = useState([]);
  useEffect(() => {
    console.log(location);
  }, [location]);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      autocompleteService.details = new window.google.maps.places.PlacesService(
        document.getElementById(`map`)
      );
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(
      {
        input: inputValue,
      },
      (results) => {
        if (active) {
          let newOptions = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <>
      <div id="map" />
      <Autocomplete
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        getOptionSelected={(option, value) =>
          option.description === value.description
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        disableClearable
        includeInputInList
        filterSelectedOptions
        value={value}
        style={{ flexGrow: 2 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={errorMessage || "Add a location"}
            // variant="outlined"
            error={!!errorMessage}
          />
        )}
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setLocation(newValue);
          if (newValue) {
            autocompleteService.details.getDetails(
              {
                placeId: newValue.place_id,
                fields: ["name", "geometry", "formatted_address", "place_id"],
              },
              (place, status) => {
                setLocation({ ...newValue, ...place });
              }
            );
          } else {
            setLocation({ description: "" });
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderOption={(option) => {
          const matches =
            option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match) => [match.offset, match.offset + match.length])
          );

          return (
            <Grid container alignItems="center">
              <Grid item>
                <LocationOnIcon className={classes.icon} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}

                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    </>
  );
}
