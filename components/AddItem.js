import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import uuid from "uuid";

const CREATE_LIST_ITEM = gql`
  mutation addListItemToCard(
    $board_id: ID
    $card_id: ID!
    $_id: ID!
    $description: String!
    $status: Boolean!
  ) {
    addListItemToCard(
      board_id: $board_id
      card_id: $card_id
      _id: $_id
      description: $description
      status: $status
    )
  }
`;

const AddItem = props => {
  debugger;
  const [description, setDescription] = useState("");

  const { card_id, board_id } = props;

  const _id = uuid();

  const { recordButtonPress } = props;

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
    event.stopPropagation();
  };

  return (
    <Fragment>
      <Mutation mutation={CREATE_LIST_ITEM}>
        {(addListItemToCard, { loading, error, data }) => (
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
                await addListItemToCard({
                  variables: {
                    board_id: board_id,
                    description: description,
                    _id: _id,
                    card_id: card_id,
                    status: false
                  }
                });
                recordButtonPress();
                setDescription("");
              }}
            >
              <div>
                <label>Describe your task</label>
                <br />
                <br />
                <input
                  type="text"
                  name="description"
                  value={description}
                  onChange={handleDescriptionChange}
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

export default AddItem;
