import Link from "next/link";
import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

const List = props => {
  return (
    <div>
      <p>title:{props.title}</p>
    </div>
  );
};

export default List;
