import { jsx } from "@emotion/core";
import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import UserDashboard from "../components/Dashboard";

function Home() {
  return (
    <div>
      <Query
        query={gql`
          {
            me {
              _id
              name
              email
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) {
            Router.push(`/login`);
            return <p>Redirecting to login...</p>;
          }
          if (data) {
            return <UserDashboard _id={data.me._id} />;
          }
        }}
      </Query>
    </div>
  );
}

export default Home;
