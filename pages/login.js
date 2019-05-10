import Link from "next/link";
import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
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
                const token = await login({
                  variables: {
                    email: email,
                    password: password
                  }
                });
                const timestamp = new Date().getTime();
                const exp = timestamp + 60 * 60 * 24 * 1000 * 7;
                document.cookie = `id_token=${
                  token.data.login
                }; expires=${exp}`;
                setEmail("");
                setPassword("");
                Router.push({
                  pathname: "/user",
                  query: { email: email }
                });
              }}
            >
              <div>
                <label>Email:</label>
                <br />
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <br />
              <div>
                <label>Password:</label>
                <br />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <br />
              <div>
                <button type="submit">Log In</button>
              </div>
              <br />
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>Invalid email or password</p>}
            {data && <p>Success!</p>}
          </div>
        )}
      </Mutation>
      <br />
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
