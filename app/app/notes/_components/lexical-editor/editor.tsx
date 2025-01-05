'use client';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { editorConfig } from './editor-config';
import { useUpdateNote } from '@/lib/db-adapter';
import { $convertToMarkdownString } from '@lexical/markdown';
import { useGetNote } from './use-get-note';
import { NoteUpdatePlugin } from './note-update-plugin';
import { serializedDocumentFromEditorState } from '@lexical/file';
import ToolbarPlugin from './plugins/toolbar/toolbar-plugin';
import { ToolbarContext } from './plugins/toolbar/toolbar-context';
import ShortcutsPlugin from './plugins/shortcuts';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import FloatingMenuPlugin from './plugins/floating-menu';
import { TRANSFORMERS } from './plugins/markdown/transformers';
import { useRef } from 'react';
import './styles.css';
import { fromArrayPack, minify, toArrayPack, unminify } from 'lexical-minifier';
import { $getRoot } from 'lexical';
import LZUTF8_LIGHT from 'lzutf8-light';

// const skipCollaborationInit =
//   // @ts-expect-error
//   window.parent != null && window.parent.frames.right === window;
let timeoutId: NodeJS.Timeout;

function debounce(cb: any, delay: number) {
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

const placeholder = 'Enter some text...';

export default function Editor() {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const note = useGetNote();
  const updateNote = useUpdateNote();

  const onChange = debounce((editorState: any, editor: any) => {
    if (note?.id) {
      editor.update(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        const editor_state = serializedDocumentFromEditorState(editorState);
        const minified = minify($getRoot());
        const arrayPack = toArrayPack(minified);
        // We need to minify just the root, so the entire editor state obj
        // needs to be rebuilt in order to later load the note from the saved state
        const newState = { ...editor_state, editorState: { root: arrayPack } };
        const compressed = LZUTF8_LIGHT.compress(JSON.stringify(newState));
        // The compressed output is a Buffer that cannot be decompressed
        // after stringifying->parsing it when loaded later so we need to encode it into a string
        const encoded = LZUTF8_LIGHT.encodeStorageBinaryString(compressed);
        updateNote({ ...note, content: markdown, editor_state: encoded });
      });
    }
  }, 2000);

  const decompUnpackUnmin = (str: string) => {
    const decoded = LZUTF8_LIGHT.decodeStorageBinaryString(str);
    const decomp = LZUTF8_LIGHT.decompress(decoded);
    const state = JSON.parse(decomp);
    const unpacked = fromArrayPack(state.editorState.root);
    const unmin = unminify(unpacked);
    return { ...state, editorState: { root: unmin } };
  };

  // const editorState = JSON.stringify(note?.editor_state);
  const editorState =
    note && note?.editor_state && decompUnpackUnmin(note?.editor_state);
  // TODO - Might need to do something like `createEmptyHistoryState` when changing notes
  // and `editor.setEditable(false)` when selecting directories
  return (
    <LexicalComposer initialConfig={{ ...editorConfig, editorState }}>
      <ToolbarContext>
        <div className="relative h-full">
          <ToolbarPlugin />
          <div className="relative  h-[calc(100%-36px)] ">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  ref={contentEditableRef}
                  className="content-editable p-4 overflow-auto h-full outline-none"
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
            <ShortcutsPlugin />
            <CheckListPlugin />
            <MarkdownShortcutPlugin />
            <FloatingMenuPlugin scrollingEl={contentEditableRef.current!} />
            {note ? (
              <NoteUpdatePlugin
                note={note}
                onChange={onChange}
                decompUnpackUnmin={decompUnpackUnmin}
              />
            ) : null}
          </div>
        </div>
      </ToolbarContext>
    </LexicalComposer>
  );
}
