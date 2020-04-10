import { createMuiTheme } from "@material-ui/core/styles";
import { red, grey, amber } from "@material-ui/core/colors";

const font1 = '"Libre Baskerville", serif';

const font2 = '"Roboto Condensed",sans-serif';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[600],
    },
    secondary: {
      main: amber[800],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#f1f1f3",
      // paper: "$fff",
    },
  },
  typography: {
    fontFamily: [font2].join(","),
    h1: { fontFamily: font1, fontSize: "3rem" },
    h2: { fontFamily: font1, fontSize: "2.5rem" },
    h3: { fontFamily: font1, fontSize: "2rem" },
    h4: { fontFamily: font1, fontSize: "2rem" },
    h5: { fontFamily: font1, fontSize: "1.8rem" },
    h6: { fontFamily: font1, fontSize: "1.5rem" },
    body1: { fontFamily: font2, fontSize: "1rem", fontWeight: "bold" },
  },
});

export default theme;
