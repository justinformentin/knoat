import React, { Fragment } from "react";

import {
  faInbox,
  faEnvelope,
  faTrash,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

import LabelItem from "./LabelItem";

const Folders = ({labels, navigateToList}) => {
  const inboxLabel = {
    ...labels.find(el => el.id === "INBOX"),
    name: "Inbox",
    icon: faInbox
  };
  const sentLabel = {
    ...labels.find(el => el.id === "SENT"),
    messagesUnread: 0,
    name: "Sent",
    icon: faEnvelope
  };
  const trashLabel = {
    ...labels.find(el => el.id === "TRASH"),
    messagesUnread: 0,
    name: "Trash",
    icon: faTrash
  };
  const spamLabel = {
    ...labels.find(el => el.id === "SPAM"),
    name: "Spam",
    icon: faExclamationCircle
  };

  const folders = [inboxLabel, sentLabel, trashLabel, spamLabel];

  return (
    <Fragment>
      <li key="olders-nav-title" className="pl-2 nav-title">
        Folders
      </li>
      {folders.map(el => {
        const iconProps = { icon: el.icon, size: "lg" };
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

export default Folders;
