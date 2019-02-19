import React, { Fragment } from "react";

import {
  faCircle
} from "@fortawesome/free-solid-svg-icons";

import { LabelItem } from "./LabelItem";

const Labels = ({labels, navigateToList}) => {
  return (
    <Fragment>
      <li key="olders-nav-title" className="pl-2 nav-title">
        Labels
      </li>
      {labels.map(el => {
        const iconProps = {
          icon: faCircle,
          color: el.color ? el.color.backgroundColor : "gainsboro",
          size: "sm"
        };
        return (
          <LabelItem
            key={el.id + "_label"}
            onClick={navigateToList}
            name={el.name}
            id={el.id}
            messagesUnread={el.messagesUnread}
            iconProps={iconProps}
            selected={el.selected}
          />
        );
      })}
    </Fragment>
  );
}

export default Labels;
