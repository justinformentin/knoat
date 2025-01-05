import './index.css';

import { $isCodeHighlightNode } from '@lexical/code';
// import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  getDOMSelection,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from 'lexical';
import {  useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { getSelectedNode } from '../../utils/get-selected-node';
import { getDOMRangeRect } from '../../utils/get-dom-range-rect';
import { setFloatingElemPosition } from '../../utils/set-floating-el-pos';
// import {INSERT_INLINE_COMMAND} from '../CommentPlugin';
import {
  Bold,
  Code,
  Italic,
  Strikethrough,
  Superscript,
  Subscript,
  Underline,
} from 'lucide-react';
import { useToolbarState } from '../toolbar/toolbar-context';
import AISelection from './ai-selection';

interface SharedProps {
  label: string;
  Icon: any;
}
interface ToolbarButtonProps extends SharedProps {
  onClick: () => void;
  activeClass?: string;
}

interface ButtonItem extends SharedProps {
  command: TextFormatType;
  stateKey: string;
}
const items: ButtonItem[] = [
  { label: 'Bold', Icon: Bold, command: 'bold', stateKey: 'isBold' },
  { label: 'Italic', Icon: Italic, command: 'italic', stateKey: 'isItalic' },
  {
    label: 'Underline',
    Icon: Underline,
    command: 'underline',
    stateKey: 'isUnderline',
  },
  {
    command: 'strikethrough',
    stateKey: 'isStrikethrough',
    label: 'Strikethrough',
    Icon: Strikethrough,
  },
  {
    command: 'subscript',
    stateKey: 'isSubscript',
    label: 'Subscript',
    Icon: Subscript,
  },
  {
    command: 'superscript',
    stateKey: 'isSuperscript',
    label: 'Superscript',
    Icon: Superscript,
  },
  { label: 'Code', Icon: Code, command: 'code', stateKey: 'isCode' },
];
const ToolbarButton = ({
  onClick,
  label,
  Icon,
  activeClass,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={'popup-item spaced ' + activeClass}
      aria-label={'Format ' + label}
    >
      <Icon className="size-4 self-center" />
    </button>
  );
};

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  toolbarState,
  scrollingEl,
  //   setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  toolbarState: any;
  scrollingEl: HTMLElement;
  //   setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);
  //   const insertLink = useCallback(() => {
  //     if (!isLink) {
  //       setIsLinkEditMode(true);
  //       editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
  //     } else {
  //       setIsLinkEditMode(false);
  //       editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  //     }
  //   }, [editor, isLink, setIsLinkEditMode]);

  //   const insertComment = () => {
  //     editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  //   };

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = 'none';
        }
      }
    }
  }
  function mouseUpListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem
        // isLink
      );
    }
  }, [
    editor,
    anchorElem,
    // isLink
  ]);

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    typeof window !== 'undefined' && window.addEventListener('resize', update);
    if (scrollingEl) {
      scrollingEl.addEventListener('scroll', update);
    }

    return () => {
      typeof window !== 'undefined' && window.removeEventListener('resize', update);
      if (scrollingEl) {
        scrollingEl.removeEventListener('scroll', update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  return (
    <div ref={popupCharStylesEditorRef} className="floating-text-format-popup">
      {editor.isEditable() && (
        <>
          <AISelection editor={editor} />
          {items.map((item) => (
            <ToolbarButton
              key={item.label}
              label={item.label}
              Icon={item.Icon}
              activeClass={toolbarState[item.stateKey] ? 'active' : ''}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, item.command);
              }}
            ></ToolbarButton>
          ))}
          {/* <button
            type="button"
            onClick={insertLink}
            className={'popup-item spaced ' + (isLink ? 'active' : '')}
            title="Insert link"
            aria-label="Insert link">
            <i className="format link" />
          </button> */}
        </>
      )}
      {/* <button
        type="button"
        onClick={insertComment}
        className={'popup-item spaced insert-comment'}
        title="Insert comment"
        aria-label="Insert comment">
        <i className="format add-comment" />
      </button> */}
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  scrollingEl: HTMLElement
  //   setIsLinkEditMode: Dispatch<boolean>
): JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const { toolbarState, updateToolbarState } = useToolbarState();

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      updateToolbarState('isBold', selection.hasFormat('bold'));
      updateToolbarState('isItalic', selection.hasFormat('italic'));
      updateToolbarState('isUnderline', selection.hasFormat('underline'));
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough')
      );
      updateToolbarState('isSubscript', selection.hasFormat('subscript'));
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
      updateToolbarState('isCode', selection.hasFormat('code'));

      // Update links
      //   const parent = node.getParent();
      //   if ($isLinkNode(parent) || $isLinkNode(node)) {
      //     setIsLink(true);
      //   } else {
      //     setIsLink(false);
      //   }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(node) || $isParagraphNode(node));
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', updatePopup);
    return () => {
      document.removeEventListener('selectionchange', updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      })
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }
  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={document.body}
      scrollingEl={scrollingEl}
      toolbarState={toolbarState}
    />,
    document.body
  );
}

export default function FloatingMenuPlugin({
  scrollingEl,
  //   setIsLinkEditMode,
}: {
  scrollingEl: HTMLElement;
  //   setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(
    editor,
    scrollingEl
    // setIsLinkEditMode
  );
}
