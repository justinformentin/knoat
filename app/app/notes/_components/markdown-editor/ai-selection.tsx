'use client';
import { useOutsideClick } from '@/lib/use-outside-click';
import { useEffect, useRef, useState } from 'react';
import {
  activeEditor$,
  currentSelection$,
  getSelectionRectangle,
  useCellValues,
} from '@mdxeditor/editor';
import { $getSelection, RangeSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { createPortal } from 'react-dom';
import AIPopupButtons from './ai-popup-buttons';
import { debounce } from '@/lib/debounce';

type LockedSelectionType = {
  text: string | undefined;
  currentSelection: RangeSelection | null;
  location: { x: number | null; y: number | null };
};
export default function AISelection({ children }: any) {
  const initialLockedSelection = {
    text: '',
    currentSelection: null,
    location: { x: null, y: null },
  };
  const lockedSelection = useRef<LockedSelectionType>(initialLockedSelection);
  const [currentSelection, activeEditor] = useCellValues(
    currentSelection$,
    activeEditor$
  );

  // TODO - I'm not sure what's better. Using state I can debounce the input
  // But then the state updates constantly. If I don't use state, the component
  // is still updating due to the useCellValues, but the state isn't updating, but there's no debounce.
  const [selectedText, setSelectedText] = useState<LockedSelectionType>(
    initialLockedSelection
  );

  const updateSelectedText = debounce(() => {
    activeEditor?.getEditorState().read(() => {
      const text = currentSelection?.getTextContent();
      if (!text) {
        if(selectedText.text) setSelectedText(initialLockedSelection);
        return;
      }
      const rectangle = getSelectionRectangle(activeEditor);
      // he X location is either at the beginning of the selection or
      // the end depending on what direction wer're selecting
      //   const xOffset = currentSelection?.isBackward() ? 0 : rectangle?.width!;
      //   const x = rectangle?.left! + xOffset;
      const x = rectangle?.left! + rectangle?.width! / 2;
      const location = { x, y: rectangle?.top! + rectangle?.height! };
      setSelectedText({ text, currentSelection, location });
    });
  }, 50);

  useEffect(() => {
    updateSelectedText();
  }, [currentSelection]);

//   console.log('SELECTED TEXT', selectedText);
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openDropdown = () => setOpen(true);

  useOutsideClick(buttonRef, () => setOpen(false));

  const wait = (): Promise<{ text: string }> =>
    new Promise((res) => setTimeout(() => res({ text: 'TEST' }), 1000));

  const replaceText = async (action: string) => {
    setOpen(false);
    setLoading(true);
    // We need to lock the selection so that while the ai is responding, the user doesn't change the selection
    // Since the text we're replacing and the styles we need to change are related to the "submitted" selection
    // If the user clicks somewhere else, that `currentSelection` changes
    lockedSelection.current = selectedText!;

    // Save parent elements so we don't have to get them again through the keys;
    const parentEls: HTMLElement[] = [];

    // We have to do these transformations inside the editor update cycle
    activeEditor?.update(() => {
      // The selected nodes will always be an array. In case the selection
      // includes multiple nodes, we need to loop through them to apply the styles
      lockedSelection.current.currentSelection?.getNodes().map((node) => {
        // Can't apply styles to nodes, need to the get the node parent
        const key = node.getParent()?.getKey();
        if (key) {
          const el = activeEditor.getElementByKey(key);
          if (el) {
            el?.classList.add('animate-pulse', 'bg-gray-400/30');
            // Change the selection background
            $patchStyleText(lockedSelection.current.currentSelection!, {
              background: '#d0e0ff',
            });
            parentEls.push(el);
          }
        }
      });
    });
    // const json = await wait();
    const res = await fetch('/api/text-replace', {
      method: 'POST',
      body: JSON.stringify({
        prompt: action + selectedText!.text,
      }),
    });
    const json = await res.json();

    activeEditor?.update(() => {
      parentEls.forEach((el) => {
        el?.classList.remove('animate-pulse', 'bg-gray-400/30');
      });
      $patchStyleText(lockedSelection.current.currentSelection!, {
        background: null,
      });

      // We clear our selection
      lockedSelection.current.currentSelection?.extract();

      // And once cleared, the "selection" changes since now it's a single point
      // So we need to get the new selection and insert the text there
      const selection = $getSelection();
      selection?.insertRawText(json.text);
    });
    setLoading(false);
    lockedSelection.current = initialLockedSelection;
    setSelectedText(initialLockedSelection)
  };

  const showButton =
    selectedText?.text && selectedText?.location.x && selectedText?.location.y;
  return (
    <>
      {showButton
        ? createPortal(
            <AIPopupButtons
              open={open}
              loading={loading}
              buttonRef={buttonRef}
              openDropdown={openDropdown}
              replaceText={replaceText}
              // @ts-ignore TODO - fix this. The button will only be rendered if location x and y are not null
              location={selectedText.location}
            />,
            document.body
          )
        : null}
      {children}
    </>
  );
}
