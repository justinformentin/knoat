'use client';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from './toolbar-plugin';
import ActionsPlugin from './actions-plugin';
import { editorConfig } from './editor-config';
import './styles.css';

const placeholder = 'Enter some text...';

export default function Editor({ user, note }: { user: any; note?: any }) {
  function onChange(editorState: any) {
    console.log('edit', editorState);
  }

  const initialState = note && note.content || null;
  const noteId = note && note.id || null;
  return (
    <LexicalComposer
      initialConfig={{ ...editorConfig, editorState: initialState }}
    >
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin
            onChange={onChange}
            ignoreHistoryMergeTagChange={false}
            ignoreSelectionChange={true}
          />
          <ActionsPlugin noteId={noteId} user={user} />
        </div>
      </div>
    </LexicalComposer>
  );
}
