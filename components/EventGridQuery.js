import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useState } from "react";
import { useQuery, NetworkStatus } from "@apollo/client";
import Loading from "./Loading";
import EventGridCard from "./EventGridCard";

const EventGridQuery = ({ query, variables }) => {
  const [more, setMore] = useState(true);

  const { loading, error, data, fetchMore, networkStatus } = useQuery(query, {
    variables,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });
  const events = data && data.events;

  const loadingMoreEvents = networkStatus === NetworkStatus.fetchMore;

  const loadMoreEvents = () => {
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
        return Object.assign({}, previousResult, {
          // Append the new posts results to the old one
          events: [...previousResult.events, ...fetchMoreResult.events],
        });
      },
    });
  };

  if (loading && !loadMoreEvents)
    return (
      <Box my={3} style={{ display: "flex", justifyContent: "center" }}>
        <Loading />
      </Box>
    );
  if (error)
    return (
      <Box my={3} style={{ display: "flex", justifyContent: "center" }}>
        Error
      </Box>
    );
  return (
    <>
      {events && (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={event.opus_id}>
              <EventGridCard event={event} />
            </Grid>
          ))}
        </Grid>
      )}
      {loading && (
        <Box my={3} style={{ display: "flex", justifyContent: "center" }}>
          <Loading />
        </Box>
      )}
      {events && events.length >= variables.first && more && (
        <Box my={3} style={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => loadMoreEvents()}
            disabled={loadingMoreEvents}
            variant="contained"
            color="secondary"
            disableElevation
          >
            {loadingMoreEvents ? "Loading..." : "Show More"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default EventGridQuery;
