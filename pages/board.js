import React, { Fragment, useState } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "next/router";
import List from "../components/List";
import AddList from "../components/AddList";

const GET_FULL_BOARD_INFO = gql`
  query board($_id: ID) {
    board(_id: $_id) {
      _id
      title
      members {
        _id
      }
      lists {
        _id
        title
      }
      cards {
        board_id
        _id
        list_id
        title
        deadLine
        comments
        checklist {
          board_id
          card_id
          _id
          description
          status
        }
      }
    }
  }
`;

const board = props => {
  const [showAddList, setShowAddList] = useState(false);

  const appendList = event => {
    setShowAddList(true);
    event.stopPropagation();
  };

  const recordButtonPress = () => {
    setTimeout(() => setShowAddList(false), 2000);
  };

  const lists = data => {
    if (data.lists && data.lists.length !== 0) {
      const board_id = data._id;
      const { cards } = data;
      return data.lists.map((list, index) => (
        <Fragment>
          <List
            title={list.title}
            _id={list._id}
            board_id={board_id}
            cards={
              cards ? cards.filter(card => card.list_id === list._id) : null
            }
            key={index}
          />
        </Fragment>
      ));
    }
  };

  const _id = props.router.query.id;
  return (
    <Query query={GET_FULL_BOARD_INFO} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>ERROR: {error.message}</p>;
        if (data && data.board) {
          return (
            <div
              css={{
                backgroundColor: "rgb(240, 210, 75)",
                color: "#fff",
                padding: "2%"
              }}
            >
              <h2>Board: {data.board.title}</h2>
              <button
                css={{ backgroundColor: "#fff", color: "rgb(240, 210, 75)" }}
                onClick={appendList}
              >
                +List
              </button>
              <br />
              {showAddList ? (
                <AddList board_id={_id} recordButtonPress={recordButtonPress} />
              ) : (
                <div />
              )}
              <Fragment>{lists(data.board)}</Fragment>
              {!(data.board.lists && data.board.lists.length) ? (
                <p>
                  This board does not have any lists yet. When it does, they
                  will appear here.
                </p>
              ) : (
                <div />
              )}
            </div>
          );
        }
      }}
    </Query>
  );
};

export default withRouter(board);
