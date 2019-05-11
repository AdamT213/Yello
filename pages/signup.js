import Link from "next/link";
import { jsx } from "@emotion/core";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import React, { Fragment, useState } from "react";
import Router from "next/router";

const SIGNUP = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password)
  }
`;

const signup = props => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  return (
    <Fragment>
      <Mutation mutation={SIGNUP}>
        {(signup, { loading, error, data }) => (
          <div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const token = await signup({
                  variables: {
                    name: name,
                    email: email,
                    password: password
                  }
                });
                const timestamp = new Date().getTime();
                const exp = timestamp + 60 * 60 * 24 * 1000 * 7;
                document.cookie = `id_token = ${
                  token.data.signup
                }; expires=${exp};`;
                setName("");
                setEmail("");
                setPassword("");
                Router.push({
                  pathname: "/user",
                  query: { email: email }
                });
              }}
            >
              <div>
                <label>Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <br />
              <div>
                <label>Email</label>
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
                <label>Password </label>
                <br />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              <br />
              <button type="Submit">Sign up!</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p>Error :( Please try again</p>}
            {data && <p>Successfully created Account!</p>}
          </div>
        )}
      </Mutation>
    </Fragment>
  );
};

export default signup;
