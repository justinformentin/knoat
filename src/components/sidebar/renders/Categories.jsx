import React, { Fragment } from "react";
import {
  faInbox,
  faUsers,
  faInfoCircle,
  faComments,
  faTag
} from "@fortawesome/free-solid-svg-icons";
import LabelItem from "./LabelItem";

const Categories = ({labels, navigateToList}) => {

  const catPersonal = {
    ...labels.find(el => el.id === "CATEGORY_PERSONAL"),
    name: "Personal",
    icon: faInbox
  };
  const catSocial = {
    ...labels.find(el => el.id === "CATEGORY_SOCIAL"),
    name: "Social",
    icon: faUsers
  };
  const catPromotions = {
    ...labels.find(el => el.id === "CATEGORY_PROMOTIONS"),
    name: "Promotions",
    icon: faTag
  };
  const catUpdates = {
    ...labels.find(el => el.id === "CATEGORY_UPDATES"),
    name: "Updates",
    icon: faInfoCircle
  };
  const catForums = {
    ...labels.find(el => el.id === "CATEGORY_FORUMS"),
    name: "Forums",
    icon: faComments
  };

  const categories = [catPersonal, catSocial, catPromotions, catUpdates, catForums];

  return (
    <Fragment>
      <li key="olders-nav-title" className="pl-2 nav-title">
        Categories
      </li>
      {categories.map(el => {
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

export default Categories;
