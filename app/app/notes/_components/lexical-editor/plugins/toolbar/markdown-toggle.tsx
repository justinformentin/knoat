'use client';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { $createTextNode, $getRoot } from 'lexical';
import { useCallback } from 'react';
import { TRANSFORMERS } from '../markdown/transformers';
import { ToolbarButton } from './toolbar-button';

const MarkdownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="size-4"
  >
    <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z" />
    <path
      fillRule="evenodd"
      d="M9.146 8.146a.5.5 0 0 1 .708 0L11.5 9.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708z"
    />
    <path
      fillRule="evenodd"
      d="M11.5 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z"
    />
    <path d="M3.56 11V7.01h.056l1.428 3.239h.774l1.42-3.24h.056V11h1.073V5.001h-1.2l-1.71 3.894h-.039l-1.71-3.894H2.5V11h1.06z" />
  </svg>
);

export const MarkdownToggle = ({ editor, toolbarState }: any) => {
  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        console.log('FIRST')
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          TRANSFORMERS,
          undefined, // node
          true // shouldPreserveNewLinesInMarkdown,
        );
      } else {
        const markdown = $convertToMarkdownString(
          TRANSFORMERS,
          undefined, //node
          true // shouldPreserveNewLinesInMarkdown,
        );
        console.log('SECOND')

        const codeNode = $createCodeNode('markdown');
        codeNode.append($createTextNode(markdown));
        root.clear().append(codeNode);
        if (markdown.length === 0) {
          codeNode.select();
        }
      }
    });
  }, [editor]);

  return (
    <ToolbarButton
      label="Toggle Markdown"
      Icon={MarkdownIcon}
      className="toolbar-item"
      onClick={handleMarkdownToggle}
    />
  );
};
