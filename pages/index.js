import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Layout from "../components/Layout";
import Card from "@material-ui/core/Card";
import gql from "graphql-tag";

import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Link from "../components/Link";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import { withApollo } from "../utils/apollo";
import { useQuery } from "@apollo/react-hooks";

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "#fff",
    height: "100%",
  },
  img: { width: "100%" },
}));

export const ALL_EVENTS_QUERY = gql`
  query($first: Int, $offset: Int, $start: String, $end: String) {
    events: Event(
      first: $first
      offset: $offset
      filter: {
        Tag_some: { name: "[Opera Alliance] Boston Opera Calendar" }
        Instance: {
          endDateTime_gte: { formatted: $start }
          startDateTime_lte: { formatted: $end }
        }
      }
      orderBy: [_id_asc]
    ) {
      _id
      opus_id
      title
      slug
      image_url
      displayInstanceDaterange(withYear: true)
      organizerNames
    }
  }
`;
export const allEventsQueryVars = {
  offset: 0,
  first: 10,
};

function Index({ theme }) {
  const classes = useStyles();
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    ALL_EVENTS_QUERY,
    {
      variables: {
        offset: allEventsQueryVars.offset,
        first: allEventsQueryVars.first,
        start: "2020-04-01",
        end: "2021-12-31",
      },
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
    }
  );
  const events = data && data.events;
  return (
    <Layout>
      <Box my={2}>
        {events && (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={event.opus_id}>
                <Card elevation={0} square className={classes.card}>
                  <CardActionArea
                    component={Link}
                    href={`/event/${event.opus_id}`}
                  >
                    <div>
                      <picture>
                        <source
                          media={`(min-width: ${theme.breakpoints.values.lg}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_170,w_290,z_0.3/l_text:Arial_35_bold:LARGE/${event.image_url}`}
                        />
                        <source
                          media={`(min-width: ${theme.breakpoints.values.md}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_221,w_377,z_0.3/l_text:Arial_35_bold:MEDIUM/${event.image_url}`}
                        />
                        <source
                          media={`(min-width: ${theme.breakpoints.values.sm}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_248,w_433,z_0.3/l_text:Arial_35_bold:SMALL/${event.image_url}`}
                        />
                        <source
                          media={`(min-width: ${theme.breakpoints.values.xs}px)`}
                          sizes="100vw"
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_315,w_547,z_0.3/l_text:Arial_35_bold:EXTRASMALL/${event.image_url}`}
                        />
                        <img
                          srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,h_200,w_548,z_0.3/${event.image_url}`}
                          className={classes.img}
                          alt={event.title}
                        />
                      </picture>
                    </div>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2">
                        {event.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {event.organizerNames}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
}

export default withApollo({ ssr: true })(withTheme(Index));
