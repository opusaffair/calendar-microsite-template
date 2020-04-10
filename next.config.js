const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  target: "serverless",
  env: {
    GRAPHQL_URI: process.env.GRAPHQL_URI,
  },
};
