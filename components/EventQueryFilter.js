import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
} from "@material-ui/core";
// import dynamic from "next/dynamic";
import Head from "next/head";
import MomentUtils from "@material-ui/pickers/adapter/moment";
import { DatePicker, LocalizationProvider } from "@material-ui/pickers";
import SortIcon from "@material-ui/icons/Sort";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useState } from "react";
import TagAuto from "./TagAuto";
import GooglePlaces from "./GooglePlaces";
import RenderMap from "./RenderMap";
import { makeStyles } from "@material-ui/core/styles";
// const DynamicSpiderfier = dynamic(() =>
//   import("npm-overlapping-marker-spiderfier")
// );

const useStyles = makeStyles({
  switchLabel: {
    fontSize: "0.8rem",
  },
});

const lib = process.env.GOOGLE_MAP_LIBRARIES;

const EventQueryFilter = ({
  startDate,
  setStart,
  endDate,
  setEnd,
  setCheckedCanceled,
  setCheckedOnline,
  checkedCanceled,
  checkedOnline,
  tags,
  setTags,
  location,
  setLocation,
  radius,
  setRadius,
  results,
  checkedLocation,
  setCheckedLocation,
  setBoundingBox,
}) => {
  const [open, setOpen] = useState(true);
  // const [checkedLocation, setCheckedLocation] = useState(true);
  const toggleCheckedOnline = () => {
    setCheckedOnline((prev) => !prev);
  };
  const toggleCheckedCanceled = () => {
    setCheckedCanceled((prev) => !prev);
  };

  const toggleCheckedLocation = () => {
    setCheckedLocation((prev) => !prev);
  };
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();

  // const { ref, map, google } = useGoogleMaps(
  //   `${process.env.GOOGLE_API_KEY}&libraries=places`,
  //   {
  //     zoom: 12,
  //     center: location,
  //     disableDefaultUI: true,
  //     zoomControl: true,
  //   }
  // );

  return (
    <ExpansionPanel
      expanded={open}
      onChange={() => {
        setOpen(!open);
      }}
    >
      <Head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js"></script>
      </Head>
      <ExpansionPanelSummary
        expandIcon={<SortIcon />}
        aria-controls="filter-panel-content"
      >
        <Typography>{open ? "Hide" : "Show"} Filters</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <LocalizationProvider dateAdapter={MomentUtils}>
          <Grid container spacing={3}>
            <Grid item md={6} container spacing={3}>
              <Grid item md={6} xs={12}>
                <DatePicker
                  renderInput={(props) => (
                    <TextField {...props} helperText="" label="Start Date" />
                  )}
                  value={startDate}
                  onChange={(date) => setStart(date)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <DatePicker
                  renderInput={(props) => (
                    <TextField {...props} helperText="" label="End Date" />
                  )}
                  value={endDate}
                  onChange={(date) => setEnd(date)}
                />
              </Grid>
              {!checkedOnline && (checkedLocation || !mdUp) && (
                <Grid item xs={12}>
                  <TagAuto tags={tags} setTags={setTags} />
                </Grid>
              )}
              <Grid item md={4} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={checkedOnline}
                      onChange={toggleCheckedOnline}
                    />
                  }
                  label="Online Only"
                  classes={{ label: classes.switchLabel }}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={checkedCanceled}
                      onChange={toggleCheckedCanceled}
                    />
                  }
                  label="Include Canceled"
                  classes={{ label: classes.switchLabel }}
                />
              </Grid>
              {!checkedOnline && (
                <Grid item md={4} xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={checkedLocation}
                        onChange={toggleCheckedLocation}
                      />
                    }
                    label="Limit by Location"
                    classes={{ label: classes.switchLabel }}
                  />
                </Grid>
              )}

              {!checkedOnline && checkedLocation && (
                <Grid item xs={12}>
                  <GooglePlaces
                    location={location}
                    setLocation={setLocation}
                    errorMessage={""}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item md={6} container spacing={3}>
              {(checkedOnline || !checkedLocation) && mdUp && (
                <Grid item xs={12}>
                  <TagAuto tags={tags} setTags={setTags} />
                </Grid>
              )}
              {checkedLocation && !checkedOnline && (
                <Grid item xs={12}>
                  {/* <EventsMap
                    location={location}
                    results={results}
                    setRadius={setRadius}
                    inputRef={ref}
                    map={map}
                    google={google}
                  /> */}
                  <RenderMap
                    lib={lib}
                    results={results}
                    location={location}
                    setRadius={setRadius}
                    radius={radius}
                    setBoundingBox={setBoundingBox}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </LocalizationProvider>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default EventQueryFilter;
