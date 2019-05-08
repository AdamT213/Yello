import { jsx } from "@emotion/core";

const Header = props => {
  return (
    <div
      css={{
        background: "rgb(216, 234, 77)",
        color: "#fff",
        width: "100%",
        height: "10%",
        Margintop: "0%",
        marginBottom: "3%"
      }}
      {...props}
    >
      <h1>Yello</h1>
      <p>Kinda like Trello but...</p>
    </div>
  );
};

export default Header;
