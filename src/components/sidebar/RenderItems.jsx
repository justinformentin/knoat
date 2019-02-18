import React from 'react';

import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";

import { Categories, Folders, Labels } from "./renders";

export const RenderItems = ({labelList, navigateToList}) => {
  if (labelList.length === 0) {
    return <div />;
  }

  const labels = labelList.reduce((acc, el) => {
    acc.push(el);
    return acc;
  }, []);

  const labelGroups = groupBy(labels, "type");

  const visibleLabels = labelGroups.user.filter(
    el =>
      !el.labelListVisibility || true
  );

  const sortedLabels = sortBy(visibleLabels, "name");

  return (
    <React.Fragment>
      <Folders
        labels={labelGroups.system}
        navigateToList={navigateToList}
      />
      <Categories
        labels={labelGroups.system}
        navigateToList={navigateToList}
      />
      <Labels
        labels={sortedLabels}
        navigateToList={navigateToList}
      />
    </React.Fragment>
  );
}