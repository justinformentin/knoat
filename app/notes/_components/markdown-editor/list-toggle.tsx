import React from 'react';

import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import {
  ButtonOrDropdownButton,
  iconComponentFor$,
  applyListType$,
  currentListType$,
} from '@mdxeditor/editor';
import { List } from 'lucide-react';

const ICON_NAME_MAP = {
  bullet: 'format_list_bulleted',
  number: 'format_list_numbered',
  check: 'format_list_checked',
} as const;

export const CustomListsToggle = () => {
  const options: ['bullet', 'number', 'check'] = ['bullet', 'number', 'check'];
  const [currentListType, iconComponentFor] = useCellValues(
    currentListType$,
    iconComponentFor$
  );
  const applyListType = usePublisher(applyListType$);

  const items = options.map((type) => ({
    value: type,
    label: iconComponentFor(ICON_NAME_MAP[type]),
  }));

  return (
    <ButtonOrDropdownButton
      value={currentListType || ''}
      //@ts-ignore
      items={items}
      //@ts-ignore
      onChoose={applyListType}
    >
      <List className="h-4 w-4" />
    </ButtonOrDropdownButton>
  );
};
