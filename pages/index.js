import { useState } from "react";
import { gql } from "@apollo/client";
import moment from "moment";
import { withApollo } from "../utils/apollo";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Layout from "../components/Layout";
import EventGridQuery from "../components/EventGridQuery";
import EventQueryFilter from "../components/EventQueryFilter";

let defaultStart = parseFloat(moment().format("X"));

export const allEventsQueryVars = {
  offset: 0,
  first: 8,
  start: defaultStart,
};

function Index() {
  const [tags, setTags] = useState([]);
  const [startDate, setStart] = useState(moment());
  const [location, setLocation] = useState({ description: "Boston, MA" });
  const [radius, setRadius] = useState(5000);
  const [endDate, setEnd] = useState(moment().add(30, "days"));
  const [checkedOnline, setCheckedOnline] = useState(true);
  const [checkedCanceled, setCheckedCanceled] = useState(false);
  const tagQuery = tags.map(
    (t) => `{
    Tag_some: {
      name_contains: "${t.name}",
    },
  }`
  );
  const siteTag = process.env.SITE_TAG;
  const siteTagString = siteTag
    ? `{Tag_some: {
      name_contains: "${siteTag}",
    }}`
    : ``;

  const onlineOnlyString = checkedOnline
    ? `{Tag_some: {
      category_contains: "Online",
    }}`
    : ``;

  const includeCanceledString = !checkedCanceled
    ? `{alert_contains:"none"}`
    : ``;

  const locationString = !checkedOnline
    ? `{Venue: {
        location_distance_lte: {
          distance: ${radius || 5000}
          point: { latitude: ${location.lat || 42.3600825}, longitude: ${
        location.lng || -71.0588801
      } }
        }}}`
    : ``;

  const ALL_EVENTS_QUERY = gql`
    query($first: Int, $offset: Int, $start: Float, $end: Float) {
      events: Event(
        first: $first
        offset: $offset
        filter: {
          AND: [
            { published: true }
            { end_datetime_gte: $start }
            { start_datetime_lte: $end }
            ${locationString}
            ${siteTagString}
            ${onlineOnlyString}
            ${includeCanceledString}
            ${tagQuery}
          ]
        }
        orderBy: [end_datetime_asc]
      ) {
        _id
        opus_id
        title
        supertitle_creative
        slug
        image_url
        displayInstanceDaterange(withYear: true)
        organizerNames
        alert
        Tag {
          _id
          name
        }
      }
    }
  `;
  return (
    <Layout>
      <Container>
        <Box my={2}>
          <EventQueryFilter
            startDate={startDate}
            endDate={endDate}
            setStart={setStart}
            setEnd={setEnd}
            checkedOnline={checkedOnline}
            setCheckedOnline={setCheckedOnline}
            checkedCanceled={checkedCanceled}
            setCheckedCanceled={setCheckedCanceled}
            tags={tags}
            setTags={setTags}
            location={location}
            setLocation={setLocation}
            radius={radius}
            setRadius={setRadius}
          />
          <EventGridQuery
            query={ALL_EVENTS_QUERY}
            variables={{
              ...allEventsQueryVars,
              end: parseInt(endDate.format("X")),
              start: parseInt(startDate.format("X")),
              radius,
              location,
            }}
          />
        </Box>
      </Container>
    </Layout>
  );
}

export default withApollo({ ssr: false })(Index);
