import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Loading from "./Loading";
import EventGridCard from "./EventGridCard";

const EventGridQuery = ({ query, variables, setResults }) => {
  const [more, setMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const useStyles = makeStyles(() => ({
    boxRow: { display: "flex", justifyContent: "center" },
  }));

  const { loading, error, data, fetchMore, networkStatus } = useQuery(query, {
    variables,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    onCompleted: useCallback((data) => {
      if (data.events.length >= variables.first) {
        setMore(true);
      } else {
        setMore(false);
      }
    }, []),
  });
  const events = data && data.events;
  const classes = useStyles();

  useEffect(() => {
    setResults(events);
    // console.log("events", events);
  }, [events]);

  const loadMoreEvents = () => {
    setFetchingMore(true);
    fetchMore({
      variables: {
        first: variables.first,
        offset: events.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult.events.length < variables.first) {
          setMore(false);
        }
        if (!fetchMoreResult) return previousResult;
        setFetchingMore(false);
        // console.log([...previousResult.events, ...fetchMoreResult.events]);
        return Object.assign({}, previousResult, {
          // Append the new posts results to the old one
          events: [...previousResult.events, ...fetchMoreResult.events],
        });
      },
    });
  };
  if (error) console.log(error);
  return (
    <div suppressHydrationWarning={true}>
      {loading && (
        <Box my={3} className={classes.boxRow} suppressHydrationWarning={true}>
          <Loading />
        </Box>
      )}
      {events && (
        <Box my={3} className={classes.boxRow}>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={event.opus_id}>
                <EventGridCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {events?.length === 0 && (
        <Box my={3} className={classes.boxRow} style={{ alignItems: "center" }}>
          No events found
        </Box>
      )}
      {more && (
        <Box my={3} className={classes.boxRow}>
          <Button
            onClick={() => loadMoreEvents()}
            disabled={fetchingMore || loading}
            variant="contained"
            color="secondary"
            disableElevation
          >
            {fetchingMore ? "Loading..." : "Show More"}
          </Button>
        </Box>
      )}
    </div>
  );
};

export default EventGridQuery;
