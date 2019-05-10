import { jsx } from "@emotion/core";

const Header = props => {
  return (
    <div
      css={{
        background: "rgb(240, 210, 75)",
        color: "#fff",
        width: "100%",
        height: "10%",
        Margintop: "0%",
        marginBottom: "3%"
      }}
      {...props}
    >
      <h1 className="cursive">Yello</h1>
      <p>Kinda like Trello but...</p>
    </div>
  );
};

export default Header;
