import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Boards from "./Boards";
import AddBoard from "./AddBoard";

const GET_BOARDS = gql`
  query boards($user_id: ID!) {
    boards(user_id: $user_id) {
      _id
      title
      lists {
        title
      }
    }
  }
`;

const UserDashboard = props => {
  const [showAddBoard, setShowAddBoard] = useState(false);

  const appendBoard = () => {
    setShowAddBoard(true);
  };

  const recordButtonPress = () => {
    setTimeout(() => setShowAddBoard(false), 2000);
  };

  const user_id = props._id;

  return (
    <div>
      <Query query={GET_BOARDS} variables={{ user_id }}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>ERROR: {error.message}</p>;
          if (data && data.boards.length) {
            return (
              <Fragment>
                <p>These are your current boards. Click one to see details</p>
                <button css={{ marginBottom: "2%" }} onClick={appendBoard}>
                  Add a new board
                </button>
                {showAddBoard ? (
                  <AddBoard
                    _id={user_id}
                    recordButtonPress={recordButtonPress}
                  />
                ) : (
                  <div />
                )}
                {data.boards.map(board => (
                  <Boards
                    title={board.title}
                    _id={board._id}
                    lists={board.lists}
                  />
                ))}
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <p>
                  You do not have any boards yet. When you do they will appear
                  here
                </p>
                <button css={{ marginBottom: "2%" }} onClick={appendBoard}>
                  Add board
                </button>
                <br />
                {showAddBoard ? (
                  <AddBoard
                    _id={user_id}
                    recordButtonPress={recordButtonPress}
                  />
                ) : (
                  <div />
                )}
              </Fragment>
            );
          }
        }}
      </Query>
    </div>
  );
};

export default UserDashboard;
