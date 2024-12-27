import { addEditorWrapper$, realmPlugin } from '@mdxeditor/editor';
import AISelection from './ai-selection';

export const selectionPlugin = realmPlugin({
  init(realm) {
    realm.pubIn({
      [addEditorWrapper$]: AISelection,
    });
  },
});
