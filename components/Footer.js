import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

export default function Footer() {
  return (
    <Typography variant="body2">
      Open source{" "}
      <Link
        color="inherit"
        href="https://github.com/opusaffair/calendar-microsite-template"
        target="_blank"
      >
        codebase
      </Link>{" "}
      on GitHub. Powered by{" "}
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
