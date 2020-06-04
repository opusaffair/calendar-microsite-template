require("dotenv").config();
module.exports = {
  target: "serverless",
  env: {
    GRAPHQL_URI: "https://api.dev.commoncalendar.org/graphql",
    // GRAPHQL_URI: "http://localhost:4000/graphql",
    // SITE_TAG: "[Opera Alliance] Boston Opera Calendar",
    SITE_DOMAIN: "http://localhost:3000",
    // SITE_DOMAIN: "https://microsite-template.now.sh",
    SITE_NAME: "Calendar Template",
    VISIBLE_TAGS: ["Online / Virtual"],
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_MAP_LIBRARIES: ["places"],
  },
};
