import React, { Fragment, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import uuid from "uuid";

const CREATE_LIST = gql`
  mutation addListToBoard($board_id: ID!, $_id: ID!, $title: String!) {
    addListToBoard(board_id: $board_id, _id: $_id, title: $title)
  }
`;

const AddList = props => {
  const [title, setTitle] = useState("");

  const { board_id } = props;

  const _id = uuid();

  const { recordButtonPress } = props;

  const handleTitleChange = event => {
    setTitle(event.target.value);
    event.stopPropagation();
  };

  return (
    <Fragment>
      <Mutation mutation={CREATE_LIST}>
        {(createList, { loading, error, data }) => (
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
                await createList({
                  variables: {
                    title: title,
                    board_id: board_id,
                    _id: _id
                  }
                });
                recordButtonPress();
                setTitle("");
              }}
            >
              <div>
                <label>Give your list a title</label>
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
                <button
                  css={{ backgroundColor: "#fff", color: "rgb(240, 210, 75)" }}
                  type="submit"
                >
                  Create
                </button>
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

export default AddList;
