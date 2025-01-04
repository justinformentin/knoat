'use client';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  NodeKey,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { RotateCcw, RotateCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSelectedNode } from '../../utils/get-selected-node';
import { ElementFormatDropdown } from './format';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { Decoration } from './decoration';
import { CodeDropdown } from './code-dropdown';
import { $isListNode, ListNode } from '@lexical/list';
import { $isCodeNode, CODE_LANGUAGE_MAP } from '@lexical/code';
import { $isHeadingNode } from '@lexical/rich-text';
import { blockTypeToBlockName, useToolbarState } from './toolbar-context';
import { BlockFormatDropDown } from './block-format-dropdown';
// import { MarkdownIcon } from './markdown-icon';
import { BoldUnderlineItalicsCode } from './bold-underline-italics-code';
import { MarkdownToggle } from './markdown-toggle';
import { AIToolbarPrompt } from './ai-toolbar-prompt';

const LowPriority = 1;
function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const { toolbarState, updateToolbarState } = useToolbarState();

  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );

  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState('blockType', type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            updateToolbarState(
              'blockType',
              type as keyof typeof blockTypeToBlockName
            );
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            updateToolbarState(
              'codeLanguage',
              language ? CODE_LANGUAGE_MAP[language] || language : ''
            );
            return;
          }
        }
      }

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      let matchingParent;
      if ($isLineBreakNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      updateToolbarState(
        'elementFormat',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left'
      );

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
      updateToolbarState(
        'fontSize',
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
      );
      updateToolbarState('isLowercase', selection.hasFormat('lowercase'));
      updateToolbarState('isUppercase', selection.hasFormat('uppercase'));
      updateToolbarState('isCapitalize', selection.hasFormat('capitalize'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="flex justify-center p-2 toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <RotateCcw
          className={`format w-4 h-4 ${!canUndo ? 'opacity-50' : ''}`}
        />
      </button>

      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <RotateCw
          className={`format w-4 h-4 ${!canRedo ? 'opacity-50' : ''}`}
        />
      </button>
      <Divider />
      <AIToolbarPrompt />
      <Divider />
      {toolbarState.blockType in blockTypeToBlockName && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={toolbarState.blockType}
            // rootType={toolbarState.rootType}
            editor={editor}
          />
          <Divider />
        </>
      )}
      {toolbarState.blockType === 'code' ? (
        <CodeDropdown
          editor={editor}
          disabled={!isEditable}
          selectedElementKey={selectedElementKey}
          codeLanguage={toolbarState.codeLanguage}
        />
      ) : (
        <>
          <BoldUnderlineItalicsCode
            editor={editor}
            toolbarState={toolbarState}
          />

          {/* )} */}
          {/* <button
              disabled={!isEditable}
              onClick={insertLink}
              className={
                'toolbar-item spaced ' + (toolbarState.isLink ? 'active' : '')
              }
              aria-label="Insert link"
            //   title={`Insert link (${SHORTCUTS.INSERT_LINK})`}
              type="button">
              <i className="format link" />
            </button> */}
          {/* <DropdownColorPicker
              disabled={!isEditable}
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting text color"
              buttonIconClassName="icon font-color"
              color={toolbarState.fontColor}
              onChange={onFontColorSelect}
              title="text color"
            />
            <DropdownColorPicker
              disabled={!isEditable}
              buttonClassName="toolbar-item color-picker"
              buttonAriaLabel="Formatting background color"
              buttonIconClassName="icon bg-color"
              color={toolbarState.bgColor}
              onChange={onBgColorSelect}
              title="bg color"
            /> */}
          <Decoration
            editor={editor}
            disabled={!isEditable}
            toolbarState={toolbarState}
          />
        </>
      )}
      <Divider />

      <ElementFormatDropdown
        disabled={!isEditable}
        // value={toolbarState.elementFormat}
        value={toolbarState.elementFormat}
        editor={editor}
        isRTL={toolbarState.isRTL}
      />
      <Divider />

      <MarkdownToggle editor={editor} toolbarState={toolbarState} />
    </div>
  );
}
