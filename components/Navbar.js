import { jsx } from "@emotion/core";
import React, { Fragment, useState } from "react";
import Router from "next/router";
import Link from "next/link";

var deleteCookie = name => {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const Navbar = () => {
  const [showWarning, setShowWarning] = useState(false);

  const handleClick = () => {
    deleteCookie("id_token");
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 2000);
    Router.push("/login");
  };

  return (
    <div
      css={{
        background: "#ffffff",
        marginBottom: "1%",
        padding: "1%",
        height: "1%",
        borderBottomStyle: "solid"
      }}
    >
      <Link href="/">
        <a>Home</a>
      </Link>
      <button css={{ marginLeft: "5%" }} onClick={handleClick}>
        Logout
      </button>
      {showWarning ? (
        <p>You are now being unsecurely logged out...</p>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Navbar;
