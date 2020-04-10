import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import NavBar from "./NavBar";

function Copyright() {
  return (
    <Typography variant="body2">
      {"Copyright © "}
      {new Date().getFullYear()}. Powered by{" "}
      <Link
        color="inherit"
        href="https://www.opusaffair.com/calendar/"
        target="_blank"
      >
        Opus Affair Event DB
      </Link>{" "}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor: theme.palette.grey[600],
    color: "#fff",
  },
}));

export default function StickyFooter(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <Container component="main" className={classes.main}>
        {props.children}
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}
