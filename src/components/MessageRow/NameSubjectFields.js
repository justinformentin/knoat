import React from "react";

export const NameSubjectFields = props => {
  return (
    <div className="wrapper text-4">
      <div className="wrapper align-items-center text-2">
        <div className="text from-name">{props.fromName}</div>
        <div className="text">{props.subject}</div>
      </div>
    </div>
  );
};
