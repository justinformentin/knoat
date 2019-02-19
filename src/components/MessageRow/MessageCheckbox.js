import React from "react";
import { Checkbox } from "../Checkbox";

const MessageCheckbox = props => {
  return (
    <div className="d-flex ml-2 justify-content-center align-items-center">
      <Checkbox checked={props.selected} onChange={props.onChange} />
    </div>
  );
};

export default MessageCheckbox;
