import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Layout from "../components/Layout";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Link from "../components/Link";

export default function Index() {
  return (
    <Layout>
      <Box my={2}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((x) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={x}>
              <Card>
                <CardActionArea component={Link} href={`/event/${x}`}>
                  <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    // height="140"
                    image={`https://picsum.photos/seed/${x}/300/200`}
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      Lizard
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Lizards are a widespread group of squamate reptiles
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}
