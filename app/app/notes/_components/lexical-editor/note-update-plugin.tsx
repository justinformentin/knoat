import { Note } from '@/server/types';
import { editorStateFromSerializedDocument } from '@lexical/file';
import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { useEffect, useRef } from 'react';
import { TRANSFORMERS } from './plugins/markdown/transformers';

export function NoteUpdatePlugin({
  note,
  onChange,
  decompUnpackUnmin,
}: {
  note: Note;
  onChange: any;
  decompUnpackUnmin: any;
}) {
  const lockUpdateCallback = useRef<boolean>(false);
  const currNote = useRef<Note | null>(null);
  const [editor] = useLexicalComposerContext();

  const clearEditor = () => {
    editor.update(() => {
      const root = $getRoot();
      const selection = $getSelection();
      const paragraph = $createParagraphNode();
      root.clear();
      root.append(paragraph);

      if (selection !== null) {
        paragraph.select();
      }
      if ($isRangeSelection(selection)) {
        selection.format = 0;
      }
    });
    return true;
  };

  useEffect(() => {
    if ((editor && !currNote.current) || currNote.current?.id !== note?.id) {
      currNote.current = note;
      if (note?.editor_state) {
        lockUpdateCallback.current = true;
        // TODO - getting weird errors when trying to setEditorState with a JSON or string
        // version of the editor_state. It works initially, but on subsequent updates,
        // it errors. So we save and load from SerializedDocument
        const es = note.editor_state && decompUnpackUnmin(note.editor_state);
        const str = JSON.stringify(es);
        const parsedState = editorStateFromSerializedDocument(editor, str);
        if (parsedState) editor.setEditorState(parsedState);
      } else if(note?.content){
        editor.update(() => {
        $convertFromMarkdownString(
          note.content,
          TRANSFORMERS,
          undefined, // node
          true // shouldPreserveNewLinesInMarkdown,
        );
      })
      } else {
        clearEditor();
      }
    }
  }, [editor, note]);

  useEffect(() => {
    if (onChange) {
      return editor.registerUpdateListener(
        ({
          editorState,
          dirtyElements,
          dirtyLeaves,
          prevEditorState,
          tags,
        }) => {
          if (
            (dirtyElements.size === 0 && dirtyLeaves.size === 0) ||
            tags.has('history-merge') ||
            prevEditorState.isEmpty()
          ) {
            return;
          }
          // We have to prevent the onChange from being called when
          // we switch notes. This is because switching notes requires setting the editorState
          // in the above useEffect, and when that happens, this listener gets fired
          // But we only want to update the note on the db on actual note updates
          if (lockUpdateCallback.current) {
            lockUpdateCallback.current = false;
          } else {
            onChange(editorState, editor, tags);
          }
        }
      );
    }
  }, [editor, onChange]);

  return null;
}
