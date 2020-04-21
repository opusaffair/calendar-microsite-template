import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    fontSize: "0.8rem",
    "& a": {
      color: theme.palette.secondary.light,
      "& :hover": {
        textDecoration: "underline",
      },
    },
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <Grid container className={classes.footer}>
      <Grid
        item
        sm={12}
        md={6}
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <div>
          Open source{" "}
          <Link
            color="inherit"
            href="https://github.com/opusaffair/calendar-microsite-template"
            target="_blank"
            className={classes.link}
          >
            codebase
          </Link>{" "}
          on GitHub. Powered by{" "}
          <Link
            color="inherit"
            href="https://www.opusaffair.com/calendar/"
            target="_blank"
            className={classes.link}
          >
            Opus Affair Event API
          </Link>
        </div>
      </Grid>
      <Grid
        item
        sm={12}
        md={6}
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <a href="#">Join the Email List</a>
        <a href="#">Submit an Event</a>
        <a href="#">Contact Us</a>
      </Grid>
    </Grid>
  );
}
