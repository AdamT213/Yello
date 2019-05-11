import Link from "next/link";
import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import Router from "next/router";

const Boards = props => {
  const { _id } = props;

  const [showBoard, setShowBoard] = useState(null);

  const handleClick = event => {
    Router.push({
      pathname: "/board",
      query: { id: event.target.id }
    });
  };

  return (
    <div
      css={{ position: "sticky", zIndex: 0 }}
      _id={_id}
      css={{ border: "1px solid rgb(240, 210, 75)", cursor: "pointer" }}
      onClick={handleClick}
    >
      <h1 css={{ fontSize: "1.2rem" }} id={_id}>
        {props.title}
      </h1>
      {showBoard ? <Board _id={_id} /> : <div />}
    </div>
  );
};

export default Boards;
