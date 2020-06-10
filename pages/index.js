import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import moment from "moment";
// import { withApollo } from "../lib/apollo";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Layout from "../components/Layout";
import EventGridQuery from "../components/EventGridQuery";
import EventQueryFilter from "../components/EventQueryFilter";
import { initializeApollo } from "lib/apolloClient";

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
  const [boundingBox, setBoundingBox] = useState({
    ne: { lat: 42.39812443863671, lng: -70.96206308339843 },
    sw: { lat: 42.32201751574154, lng: -71.15569711660156 },
  });
  const [checkedOnline, setCheckedOnline] = useState(true);
  const [checkedCanceled, setCheckedCanceled] = useState(false);
  const [checkedLocation, setCheckedLocation] = useState(false);

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

  const locationString =
    checkedLocation && !checkedOnline
      ? `{Venue: {
        location_distance_lte: {
          distance: ${radius}
          point: { latitude: ${location.lat}, longitude: ${location.lng} }
        }}}`
      : ``;

  const lngBoxString =
    boundingBox.sw.lng <= boundingBox.ne.lng
      ? `
{ Venue: { longitude_gte: ${boundingBox.sw.lng} } }
{ Venue: { longitude_lte: ${boundingBox.ne.lng} } }
`
      : `{
  OR:[{ Venue: { longitude_lte: ${boundingBox.sw.lng} } }
    { Venue: { longitude_gte: ${boundingBox.ne.lng} } }]
}`;

  const latBoxString =
    boundingBox.sw.lat <= boundingBox.ne.lat
      ? `
{ Venue: { latitude_gte: ${boundingBox.sw.lat} } }
{ Venue: { latitude_lte: ${boundingBox.ne.lat} } }
`
      : `{
OR:[{ Venue: { latitude_lte: ${boundingBox.sw.lat} } }
{ Venue: { latitude_gte: ${boundingBox.ne.lat} } }]
}`;

  const locationBoxString =
    checkedLocation && !checkedOnline ? `${latBoxString}${lngBoxString}` : ``;

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
            ${locationBoxString}
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
            setBoundingBox={setBoundingBox}
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

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();
//   const BASE_ALL_EVENTS_QUERY = gql`
//     {
//       Event(first: 10, offset: 0) {
//         _id
//         opus_id
//         title
//         supertitle_creative
//         slug
//         image_url
//         displayInstanceDaterange(withYear: true)
//         organizerNames
//         alert
//         Venue {
//           _id
//           location {
//             latitude
//             longitude
//           }
//         }
//         Tag {
//           _id
//           name
//         }
//       }
//     }
//   `;

//   await apolloClient.query({
//     query: BASE_ALL_EVENTS_QUERY,
//     variables: allEventsQueryVars,
//   });
//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//     unstable_revalidate: 1,
//   };
// }

export default Index;
