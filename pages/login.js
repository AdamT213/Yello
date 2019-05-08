import Link from "next/link";
import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    signup(email: $email, password: $password)
  }
`;

const login = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  return (
    <Fragment>
      <Mutation mutation={LOGIN}>
        {(login, { loading, error, data }) => (
          <div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                await login({
                  variables: {
                    email: email,
                    password: password
                  }
                });
                setEmail("");
                setPassword("");
                Router.push(`localhost:3000/user/@${email}`);
              }}
            >
              <div>
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <input type="submit" value="Log In" />
              </div>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>Error :( Please try again</p>}
            {data && <p>Successfully created Account!</p>}
          </div>
        )}
      </Mutation>
      <div>
        Don't have an account?
        <br />
        <Link href="/signup">
          <a>Sign up here</a>
        </Link>
      </div>
    </Fragment>
  );
};

export default login;
