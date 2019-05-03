import { jsx } from "@emotion/core";
import { Fragment } from "react";
const tester = props => {
  return (
    <Fragment>
      <p
        css={{
          color: "rgb(216, 234, 77)"
        }}
        {...props}
      >
        This color is nasty and will need to be changed
      </p>
    </Fragment>
  );
};

export default tester;
