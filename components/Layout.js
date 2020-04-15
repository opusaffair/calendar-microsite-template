import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import NavBar from "./NavBar";
import Footer from "./Footer";

// function Copyright() {
//   return (
//     <Typography variant="body2">
//       {"Copyright © "}
//       {new Date().getFullYear()}. Powered by{" "}
//       <Link
//         color="inherit"
//         href="https://www.opusaffair.com/calendar/"
//         target="_blank"
//       >
//         Opus Affair Event DB
//       </Link>{" "}
//     </Typography>
//   );
// }

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    padding: 0,
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

export default function StickyFooter(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <Container component="main" className={classes.main} maxWidth={false}>
        {props.children}
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="lg">
          <Footer />
        </Container>
      </footer>
    </div>
  );
}
