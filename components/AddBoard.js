import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import uuid from "uuid";

const CREATE_BOARD = gql`
  mutation createBoard(
    $_id: ID
    $user_id: ID
    $title: String!
    $deadline: GraphQLDate
  ) {
    createBoard(
      _id: $_id
      user_id: $user_id
      title: $title
      deadline: $deadline
    ) {
      _id
      title
      members {
        _id
      }
    }
  }
`;

const AddBoard = props => {
  const [title, setTitle] = useState("");

  const user_id = props._id;

  debugger;

  const { recordButtonPress } = props;

  const board_id = uuid();

  const handleTitleChange = event => {
    setTitle(event.target.value);
  };

  return (
    <Fragment>
      <Mutation mutation={CREATE_BOARD}>
        {(createBoard, { loading, error, data }) => (
          <div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                await createBoard({
                  variables: {
                    title: title,
                    _id: board_id,
                    user_id: user_id
                  }
                });
                recordButtonPress();
                setTitle("");
              }}
            >
              <div>
                <label>Give your board a title</label>
                <br />
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                />
                <br />
              </div>
              <div>
                <input type="submit" value="Create" />
              </div>
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

export default AddBoard;
