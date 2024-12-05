import React from 'react';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import {
  ButtonOrDropdownButton,
  iconComponentFor$,
  viewMode$,
} from '@mdxeditor/editor';

export const SourceTogglePlugin = () => {
  const [viewMode, iconComponentFor] = useCellValues(
    viewMode$,
    iconComponentFor$
  );
  const changeViewMode = usePublisher(viewMode$);

  return (
    <>
      <div style={{ marginLeft: 'auto', pointerEvents: 'auto', opacity: 1 }}>
        <ButtonOrDropdownButton
          title={'Toggle Markdown View'}
          items={[{ label: 'Toggle Markdown Source', value: 'source' }]}
          onChoose={() => {
            changeViewMode(viewMode === 'source' ? 'rich-text' : 'source');
          }}
        >
          {viewMode === 'rich-text'
            ? iconComponentFor('markdown')
            : iconComponentFor('rich_text')}
        </ButtonOrDropdownButton>
      </div>
    </>
  );
};
