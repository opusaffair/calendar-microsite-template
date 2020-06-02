import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { query } = router;
  const [tags, setTags] = useState([]);
  const [startDate, setStart] = useState(moment());
  const [endDate, setEnd] = useState(moment().add(30, "days"));
  const [location, setLocation] = useState({
    description: query.l || "Boston, MA",
    lat: 42.3600825,
    lng: -71.0588801,
  });
  const [results, setResults] = useState([]);
  const [radius, setRadius] = useState(5000);
  const [checkedOnline, setCheckedOnline] = useState(false);
  const [checkedCanceled, setCheckedCanceled] = useState(false);
  const [checkedLocation, setCheckedLocation] = useState(true);

  // useEffect(() => {
  //   const { l, lat, lng } = query;
  //   if (l && lat && lng) setLocation({ ...location, description: l });
  // }, [query]);

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

  const locationString = checkedLocation
    ? `{Venue: {
        location_distance_lte: {
          distance: ${radius}
          point: { latitude: ${location.lat}, longitude: ${location.lng} }
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
        Venue {
          _id
          location {
            latitude
            longitude
          }
        }
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
            checkedLocation={checkedLocation}
            setCheckedLocation={setCheckedLocation}
            tags={tags}
            setTags={setTags}
            location={location}
            setLocation={setLocation}
            radius={radius}
            setRadius={setRadius}
            results={results}
          />
          <EventGridQuery
            query={ALL_EVENTS_QUERY}
            setResults={setResults}
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
