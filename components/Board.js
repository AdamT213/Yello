import Link from "next/link";
import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import List from "./List";

const GET_FULL_BOARD_INFO = gql`
  query board($_id: ID) {
    board(_id: $_id) {
      _id
      title
      members {
        _id
      }
      lists {
        title
        cards {
          deadLine
          title
          comments
          checklist {
            description
            status
          }
        }
      }
    }
  }
`;

const board = props => {
  const { _id } = props;
  return (
    <Query query={GET_FULL_BOARD_INFO} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>ERROR: {error.message}</p>;
        if (data && data.board) {
          return { data };
        }
      }}
    </Query>
  );
};

export default board;
