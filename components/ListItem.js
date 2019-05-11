import React, { Fragment, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const TOGGLE_COMPLETE = gql`
  mutation markListItemComplete($card_id: ID!, $board_id: ID!, $_id: ID!) {
    markListItemComplete(card_id: $card_id, board_id: $board_id, _id: $_id)
  }
`;

const ListItem = props => {
  return (
    <div>
      <Mutation mutation={TOGGLE_COMPLETE}>
        {(markListItemComplete, { loading, error, data }) => (
          <div css={{ display: "inline-block" }}>
            <input
              type="checkbox"
              onChange={async e => {
                e.stopPropagation();
                await markListItemComplete({
                  variables: {
                    card_id: props.card_id,
                    board_id: props.board_id,
                    _id: props._id
                  }
                });
              }}
              checked={props.status}
            />
            <p>Task: {props.description}</p>
            {loading && <p>Loading...</p>}
            {error && <p>An error occurred</p>}
            {data && <p>Success!</p>}
          </div>
        )}
      </Mutation>
    </div>
  );
};

export default ListItem;
