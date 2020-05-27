import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  TextField,
  Checkbox,
  ListItem,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
} from "@material-ui/core";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import MomentUtils from "@material-ui/pickers/adapter/moment";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@material-ui/pickers";
import SortIcon from "@material-ui/icons/Sort";
import { useState } from "react";
import TagAuto from "./TagAuto";
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
}) => {
  const [open, setOpen] = useState(true);

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
                  <TextField {...props} label="Start Date" />
                )}
                value={startDate}
                onChange={(date) => setStart(date)}
              />
            </Grid>

            <Grid item md={3} xs={12}>
              <DatePicker
                renderInput={(props) => (
                  <TextField {...props} label="End Date" />
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
                />
              </FormGroup>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const CheckBoxItem = ({ item }) => (
  <ListItem
    onClick={(e) => {
      e.preventDefault();
    }}
  >
    <Checkbox checked={item.isRefined} />
    <ListItemText primary={item.label.replace(/\[.*] /, "")} />
  </ListItem>
);

export default EventQueryFilter;
