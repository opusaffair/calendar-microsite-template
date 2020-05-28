import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Slider,
} from "@material-ui/core";
import MomentUtils from "@material-ui/pickers/adapter/moment";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@material-ui/pickers";
import SortIcon from "@material-ui/icons/Sort";

import { useState } from "react";
import TagAuto from "./TagAuto";
import GooglePlaces from "./GooglePlaces";
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
}) => {
  const [open, setOpen] = useState(true);
  const metersPerPx = (lat, zoom) =>
    (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
  const toggleCheckedOnline = () => {
    setCheckedOnline((prev) => !prev);
  };
  const toggleCheckedCanceled = () => {
    setCheckedCanceled((prev) => !prev);
  };

  return (
    <ExpansionPanel
      expanded={open}
      onChange={() => {
        setOpen(!open);
      }}
    >
      <ExpansionPanelSummary
        expandIcon={<SortIcon />}
        aria-controls="filter-panel-content"
      >
        <Typography>{open ? "Hide" : "Show"} Filters</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <LocalizationProvider dateAdapter={MomentUtils}>
          <Grid container spacing={3}>
            <Grid item md={3} xs={12}>
              <DatePicker
                renderInput={(props) => (
                  <TextField {...props} helperText="" label="Start Date" />
                )}
                value={startDate}
                onChange={(date) => setStart(date)}
              />
            </Grid>

            <Grid item md={3} xs={12}>
              <DatePicker
                renderInput={(props) => (
                  <TextField {...props} helperText="" label="End Date" />
                )}
                value={endDate}
                onChange={(date) => setEnd(date)}
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <TagAuto tags={tags} setTags={setTags} />
            </Grid>

            <Grid item md={2} xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={checkedOnline}
                      onChange={toggleCheckedOnline}
                    />
                  }
                  label="Online Only"
                  style={{ marginBottom: 8 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={checkedCanceled}
                      onChange={toggleCheckedCanceled}
                    />
                  }
                  label="Include Canceled"
                  style={{ marginBottom: 8 }}
                />
              </FormGroup>
            </Grid>
            {!checkedOnline && (
              <>
                {console.log(location, radius)}

                <Grid item md={6} xs={12}>
                  <GooglePlaces
                    location={location}
                    setLocation={setLocation}
                    errorMessage={""}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Slider
                    value={radius}
                    aria-labelledby="discrete-slider"
                    onChange={(e, v) => {
                      // console.log(v);
                      setRadius(v);
                    }}
                    step={1000}
                    marks
                    min={1000}
                    max={20000}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </LocalizationProvider>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default EventQueryFilter;
