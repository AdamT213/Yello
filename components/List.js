import { jsx, css } from "@emotion/core";
import React, { Fragment, useState } from "react";
import AddCard from "./AddCard";
import Card from "./Card";

const List = props => {
  const [showAddCard, setShowAddCard] = useState(false);

  const appendCard = event => {
    setShowAddCard(true);
    event.stopPropagation();
  };

  const recordButtonPress = () => {
    setTimeout(() => setShowAddCard(false), 2000);
  };

  const cards =
    props.cards && props.cards.length !== 0 ? (
      props.cards.map((card, index) => (
        <Fragment>
          <Card
            title={card.title}
            checklist={card.checklist}
            _id={card._id}
            board_id={card.board_id}
            key={index}
          />
        </Fragment>
      ))
    ) : (
      <div />
    );

  return (
    <div
      css={css`
        background-color: #000;
        color: rgb(240, 210, 75);
        padding: 2%;
        display: inline-block;
        width: 27%;
        margin: 10px;
        text-align: center;
        vertical-align: middle;
        @media (max-width: 700px) {
          display: block;
          width: auto;
        }
      `}
    >
      <h3>List: {props.title}</h3>
      <ul>{cards}</ul>
      {!(props.cards && props.cards.length) ? (
        <p>
          This list does not have any cards yet. When it does, they will appear
          here.
        </p>
      ) : (
        <div />
      )}
      <button onClick={appendCard}>+Card</button>
      <br />
      {showAddCard ? (
        <AddCard
          board_id={props.board_id}
          list_id={props._id}
          recordButtonPress={recordButtonPress}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default List;
