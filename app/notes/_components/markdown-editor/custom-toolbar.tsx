import React from 'react';
import {
  EditorInFocus,
  DirectiveNode,
  ConditionalContents,
  Separator,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  InsertAdmonition,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertSandpack,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  ShowSandpackInfo,
  UndoRedo,
  CreateLink,
} from '@mdxeditor/editor';
function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== 'directive') {
    return false;
  }

  return ['note', 'tip', 'danger', 'info', 'caution'].includes(
    (node as DirectiveNode).getMdastNode().name
  );
}

/**
 * A toolbar component that includes all toolbar components.
 * Notice that some of the buttons will work only if you have the corresponding plugin enabled, so you should use it only for testing purposes.
 * You'll probably want to create your own toolbar component that includes only the buttons that you need.
 * @group Toolbar Components
 */
export const KitchenSinkToolbar: React.FC = () => {
  return (
    <ConditionalContents
      options={[
        {
          when: (editor) => editor?.editorType === 'codeblock',
          contents: () => <ChangeCodeMirrorLanguage />,
        },
        {
          when: (editor) => editor?.editorType === 'sandpack',
          contents: () => <ShowSandpackInfo />,
        },
        {
          fallback: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <Separator />
              <StrikeThroughSupSubToggles />
              <Separator />
              <ListsToggle />
              <Separator />

              <ConditionalContents
                options={[
                  {
                    when: whenInAdmonition,
                    contents: () => <ChangeAdmonitionType />,
                  },
                  { fallback: () => <BlockTypeSelect /> },
                ]}
              />

              <Separator />

              <CreateLink />
              <InsertImage />

              <Separator />

              <InsertTable />
              <InsertThematicBreak />

              <Separator />
              <InsertCodeBlock />
              <InsertSandpack />

              <ConditionalContents
                options={[
                  {
                    when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                    contents: () => (
                      <>
                        <Separator />
                        <InsertAdmonition />
                      </>
                    ),
                  },
                ]}
              />

              <Separator />
              <InsertFrontmatter />
            </>
          ),
        },
      ]}
    />
  );
};
