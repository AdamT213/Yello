import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import uuid from "uuid";

const CREATE_CARD = gql`
  mutation addCardToBoard(
    $_id: ID
    $list_id: ID
    $board_id: ID
    $title: String
  ) {
    addCardToBoard(
      _id: $_id
      list_id: $list_id
      board_id: $board_id
      title: $title
    )
  }
`;

const AddCard = props => {
  const [title, setTitle] = useState("");

  const { board_id, list_id } = props;

  const _id = uuid();

  const { recordButtonPress } = props;

  const handleTitleChange = event => {
    setTitle(event.target.value);
    event.stopPropagation();
  };

  return (
    <Fragment>
      <Mutation mutation={CREATE_CARD}>
        {(addCardToBoard, { loading, error, data }) => (
          <div
            css={{
              position: "sticky",
              zIndex: 2,
              padding: "5%",
              marginBottom: "5%"
            }}
          >
            <form
              onSubmit={async e => {
                e.preventDefault();
                e.stopPropagation();
                await addCardToBoard({
                  variables: {
                    title: title,
                    board_id: board_id,
                    list_id: list_id,
                    _id: _id
                  }
                });
                recordButtonPress();
                setTitle("");
              }}
            >
              <div>
                <label>Give your card a title</label>
                <br />
                <br />
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                />
                <br />
                <br />
              </div>
              <div>
                <button type="submit">Create</button>
              </div>
              <br />
              <br />
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>An error occurred</p>}
            {data && <p>Success!</p>}
          </div>
        )}
      </Mutation>
    </Fragment>
  );
};

export default AddCard;
