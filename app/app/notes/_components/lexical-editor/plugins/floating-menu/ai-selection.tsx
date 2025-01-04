'use client';
import { useRef, useState } from 'react';
import { $getSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import AIPopupButtons from './ai-popup-buttons';


export default function AISelection({ editor }: any) {

  const savedSelectionText = useRef<undefined | string>('');

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openDropdown = () => setOpen(true);

  // const wait = (): Promise<{ text: string }> =>
  //   new Promise((res) => setTimeout(() => res({ text: 'TEST' }), 1000));

  const replaceText = async (action: string) => {
    setOpen(false);
    setLoading(true);

    // Save parent elements so we don't have to get them again through the keys;
    const parentEls: HTMLElement[] = [];

    // We have to do these transformations inside the editor update cycle
    editor?.update(() => {
      const selection = $getSelection();
      savedSelectionText.current = selection?.getTextContent();
      // We need to lock the selection so that while the ai is responding, the user doesn't change the selection
      // Since the text we're replacing and the styles we need to change are related to the "submitted" selection
      // If the user clicks somewhere else, that `currentSelection` changes

      // The selected nodes will always be an array. In case the selection
      // includes multiple nodes, we need to loop through them to apply the styles
      selection?.getNodes().map((node) => {
        // Can't apply styles to nodes, need to the get the node parent
        const key = node.getParent()?.getKey();
        if (key) {
          const el = editor.getElementByKey(key);
          if (el) {
            el?.classList.add('animate-pulse', 'bg-gray-400/30');
            // Change the selection background
            $patchStyleText(selection!, {
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
        prompt: action + savedSelectionText.current,
      }),
    });
    const json = await res.json();

    editor?.update(() => {
      const selection = $getSelection();

      parentEls.forEach((el) => {
        el?.classList.remove('animate-pulse', 'bg-gray-400/30');
      });
      $patchStyleText(selection!, {
        background: null,
      });
      selection?.extract();
      selection?.insertRawText(json.text);
    });
    setLoading(false);
    savedSelectionText.current = '';
  };

  return (
    <AIPopupButtons
      open={open}
      loading={loading}
      openDropdown={openDropdown}
      replaceText={replaceText}
    />
  );
}
