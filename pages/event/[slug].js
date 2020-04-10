import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "../../components/Link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { withApollo } from "../../utils/apollo";

export default function Event() {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Event: {slug}
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}
