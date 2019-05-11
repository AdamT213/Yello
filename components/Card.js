import React, { Fragment, useState } from "react";
import AddItem from "./AddItem";
import ListItem from "./ListItem";

const Card = props => {
  const [showAddItem, setShowAddItem] = useState(false);

  const appendItem = event => {
    setShowAddItem(true);
    event.stopPropagation();
  };

  const recordButtonPress = () => {
    setTimeout(() => setShowAddItem(false), 2000);
  };

  const items = () => {
    if (props.checklist && props.checklist.length !== 0) {
      return props.checklist.map((item, index) => {
        return (
          <Fragment>
            <ListItem
              description={item.description}
              status={item.status}
              card_id={item.card_id}
              board_id={item.board_id}
              _id={item._id}
              key={index}
            />
          </Fragment>
        );
      });
    }
  };

  return (
    <div
      css={{
        backgroundColor: "#fff",
        padding: "2%",
        display: "inline-block",
        margin: "0 auto",
        marginBottom: "1%",
        width: "75%"
      }}
    >
      <h4>Card: {props.title}</h4>
      <ul>{items()}</ul>
      {!(props.checklist && props.checklist.length) ? (
        <p>
          This Card does not have any checklist items yet. When it does, they
          will appear here.
        </p>
      ) : (
        <div />
      )}
      <button onClick={appendItem}>+Item</button>
      {showAddItem ? (
        <AddItem
          card_id={props._id}
          board_id={props.board_id}
          recordButtonPress={recordButtonPress}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default Card;
