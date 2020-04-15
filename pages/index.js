import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Layout from "../components/Layout";
import Card from "@material-ui/core/Card";
import MuiAlert from "@material-ui/lab/Alert";

import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Link from "../components/Link";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { withApollo } from "../utils/apollo";
import { useQuery, gql } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "#fff",
    height: "100%",
    "&:hover, &:focus": {
      transform: "scale(1.05)",
      zIndex: 1,
      transitionDuration: "500ms",
      transitionProperty: "transform, box-shadow",
      transitionTimingFunction: "ease-out",
    },
    "& a:hover": {
      textDecoration: "none",
    },
  },
  cardContent: { height: "100%" },
  img: { width: "100%" },
}));

export const ALL_EVENTS_QUERY = gql`
  query($first: Int, $offset: Int, $start: Float) {
    events: Event(
      first: $first
      offset: $offset
      filter: {
        Tag_some: { AND: [{ name: "[Opera Alliance] Boston Opera Calendar" }] }
        end_datetime_gte: $start
      }
      orderBy: [end_datetime_asc]
    ) {
      _id
      opus_id
      title
      slug
      image_url
      displayInstanceDaterange(withYear: true)
      organizerNames
      alert
    }
  }
`;
export const allEventsQueryVars = {
  offset: 0,
  first: 10,
  start: 1588830240,
};

function Index({ theme }) {
  const classes = useStyles();
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    ALL_EVENTS_QUERY,
    {
      variables: {
        ...allEventsQueryVars,
      },
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      // notifyOnNetworkStatusChange: true,
    }
  );
  const events = data && data.events;
  return (
    <Layout>
      <Container>
        <Box my={2}>
          {events && (
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={event.opus_id}>
                  <Card elevation={0} square className={classes.card}>
                    <CardActionArea
                      component={Link}
                      href={`/event/${event.slug}`}
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <picture>
                        <source
                          media={`(min-width: ${theme.breakpoints.values.lg}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_170,w_290,z_0.3/${event.image_url}`}
                        />
                        <source
                          media={`(min-width: ${theme.breakpoints.values.md}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_221,w_377,z_0.3/${event.image_url}`}
                        />
                        <source
                          media={`(min-width: ${theme.breakpoints.values.sm}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_248,w_433,z_0.3/${event.image_url}`}
                        />
                        <source
                          media={`(min-width: ${theme.breakpoints.values.xs}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_315,w_547,z_0.3/${event.image_url}`}
                        />
                        <img
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_315,w_547,z_0.3/${event.image_url}`}
                          className={classes.img}
                          alt={event.title}
                        />
                      </picture>
                      <CardContent
                        style={{
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "column",
                        }}
                      >
                        {event.alert && event.alert != "none" && (
                          <MuiAlert
                            severity="error"
                            style={{
                              textTransform: "uppercase",
                              marginBottom: 15,
                            }}
                          >
                            {event.alert}
                          </MuiAlert>
                        )}
                        <Typography gutterBottom variant="h6" component="h2">
                          {event.title}
                        </Typography>
                        <div>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {event.displayInstanceDaterange}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {event.organizerNames}
                          </Typography>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Layout>
  );
}

export default withApollo({ ssr: true })(withTheme(Index));
