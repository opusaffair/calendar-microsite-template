import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Link from "../../components/Link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../utils/apollo";
import { useQuery, gql } from "@apollo/client";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  // card: {
  //   backgroundColor: "#fff",
  //   height: "100%",
  // },
  // cardContent: { height: "100%" },
  // img: { width: "100%", height: "100%" },
  topRow: {
    [theme.breakpoints.down("sm")]: { flexDirection: "column-reverse" },
  },
}));

const EventPhoto = ({ imageUrl, title, theme }) => (
  // <picture>
  // {/* <source
  //   media={`(min-width: ${theme.breakpoints.values.lg}px)`}
  //   sizes="100vw"
  //   srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,ar_1.7,w_680,z_0.3/${imageUrl}`}
  // />
  // <source
  //   media={`(min-width: ${theme.breakpoints.values.md}px)`}
  //   sizes="100vw"
  //   srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,ar_1.7,w_680,z_0.3/${imageUrl}`}
  // />
  // <source
  //   media={`(min-width: ${theme.breakpoints.values.sm}px)`}
  //   sizes="100vw"
  //   srcSet={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,ar_1.7,w_858,z_0.3/${imageUrl}`}
  // /> */}
  <img
    src={`https://res.cloudinary.com/opusaffair/image/fetch/c_fill,dpr_auto,f_auto,g_auto,ar_1.7,w_858,z_0.3/${imageUrl}`}
    style={{ width: "100%", height: "100%" }}
    alt={title}
  />
  // {/* </picture> */}
);

function Event({ theme }) {
  const classes = useStyles();
  const router = useRouter();
  const EVENT_DETAIL_QUERY = gql`
    query($slug: String) {
      event: Event(slug: $slug) {
        _id
        opus_id
        title
        alert
        slug
        image_url
        displayInstanceDaterange(withYear: true)
        organizerNames
        organizer_desc
      }
    }
  `;
  const { slug } = router.query;
  const { loading, data, error } = useQuery(EVENT_DETAIL_QUERY, {
    variables: { slug },
  });
  const event = data && data.event[0];
  return (
    <Layout>
      <Container
        style={{ backgroundColor: "white", width: "100%", padding: 15 }}
        maxWidth={false}
      >
        <Container maxWidth="lg">
          {loading && <div>Loading</div>}
          {error && <div>Error</div>}
          {!loading && event && (
            <div>
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
              <Grid container spacing={3} className={classes.topRow}>
                <Grid item sm={12} md={5}>
                  <Box
                    my={3}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-after",
                    }}
                  >
                    <Typography variant="h4" component="h1" gutterBottom>
                      {event.title}
                    </Typography>
                    <div>
                      <Typography variant="body1" component="h2">
                        {event.displayInstanceDaterange}
                      </Typography>
                      <Typography variant="body1" component="h2">
                        Presented by: {event.organizerNames}
                      </Typography>

                      <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        naked
                        disableElevation
                        href="/"
                      >
                        Official Site
                      </Button>
                    </div>
                  </Box>
                </Grid>
                <Grid item sm={12} md={7}>
                  <Card style={{ height: "100%", display: "flex" }}>
                    <EventPhoto
                      imageUrl={event.image_url}
                      theme={theme}
                      title={event.title}
                    />
                  </Card>
                </Grid>
              </Grid>
            </div>
          )}
        </Container>
      </Container>
      {!loading && event && (
        <Container>
          <Grid container>
            <Grid item>
              <Typography
                component="div"
                variant="body2"
                dangerouslySetInnerHTML={{ __html: event.organizer_desc }}
              ></Typography>
            </Grid>
          </Grid>
        </Container>
      )}
    </Layout>
  );
}

export default withApollo({ ssr: true })(withTheme(Event));
