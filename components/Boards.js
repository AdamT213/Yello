import Link from "next/link";
import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import Router from "next/router";
import List from "./List";
import Board from "./Board";

const Boards = props => {
  const { _id } = props;

  const [showBoard, setShowBoard] = useState(null);

  const handleClick = event => {
    debugger;
    setShowBoard(event.target.id);
  };

  const lists =
    props.lists && props.lists.length ? (
      props.lists.map((list, index) => (
        <Fragment>
          <List title={list.title} key={index} />
        </Fragment>
      ))
    ) : (
      <div />
    );

  return (
    <div
      _id={_id}
      css={{ border: "1px solid rgb(240, 210, 75)", cursor: "pointer" }}
      onClick={handleClick}
    >
      <p id={_id}>Title:{props.title}</p>
      {showBoard ? <Board _id={_id} /> : <div />}
      <ul>{lists}</ul>
    </div>
  );
};

export default Boards;
