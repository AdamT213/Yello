import Link from "next/link";
import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

const userProfile = props => {
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
            return error.message;
          }
          if (data) {
            return (
              <Fragment>
                <p>Welcome, {data.me.name.split(" ")[0]}</p>
                <br />
                To view your dashboard, click
                <Link href="/">
                  <a> here</a>
                </Link>
                <br />
                <p>Here is your recent activity:</p>
              </Fragment>
            );
          }
        }}
      </Query>
    </div>
  );
};

export default userProfile;
