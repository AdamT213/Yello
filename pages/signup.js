import Link from "next/link";
import { jsx } from "@emotion/core";
import { Formik, Form, Field, FieldArray } from "formik";
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

  // const handleSubmit = async e => {
  //   debugger;
  //   e.preventDefault();
  //   await signup({
  //     variables: {
  //       name: name,
  //       email: email,
  //       password: password
  //     }
  //   });
  //   setName("");
  //   setEmail("");
  //   setPassword("");
  //   Router.push(`localhost:3000/user/@${email}`);
  // };

  return (
    <Fragment>
      <Mutation mutation={SIGNUP}>
        {(signup, { loading, error, data }) => (
          <div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                await signup({
                  variables: {
                    name: name,
                    email: email,
                    password: password
                  }
                });
                setName("");
                setEmail("");
                setPassword("");
                Router.push(`localhost:3000/user/@${email}`);
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

// <div>
//   <Formik
//     initialValues={{
//       name: null,
//       email: null,
//       password: null
//     }}
//     render={({ values, resetForm }) => (
//       <Form
//         onSubmit={async e => {
//           console.log(e);
//           e.preventDefault();
//           const { email } = values;
//           await signup({
//             variables: {
//               name: values.name,
//               email: values.email,
//               password: values.password
//             }
//           });
//           resetForm({
//             name: null,
//             email: null,
//             password: null
//           });
//           Router.push(`localhost:3000/user/@${email}`);
//         }}
//       >
//         <div>
//           <label>Name</label>
//           <br />
//           <Field name="name" />
//         </div>
//         <br />
//         <div>
//           <label>Email</label>
//           <br />
//           <Field name="email" />
//         </div>
//         <br />
//         <div>
//           <label>Password </label>
//           <br />
//           <Field name="password" type="password" />
//         </div>
//         <br />
//         <button type="submit">Sign up!</button>
//       </Form>
//     )}
//   />
