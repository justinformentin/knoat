'use client';
import { useEffect, useRef, useState } from 'react';

export type SelectionState = {
  text: string;
  selection: Selection | null;
  location: { x: number | null; y: number | null };
};
export function useSelectedText() {
  const containerRef: any = useRef();
  const [selectedText, setSelectedText] = useState<SelectionState>({
    text: '',
    selection: null,
    location: { x: null, y: null },
  });

  const fromMouseUp = (e: any) => {
    if (typeof window.getSelection != 'undefined') {
      // The mouse event gives you mouse coords, so we can just use that
      const location = { x: e.clientX - 10, y: e.clientY + 20}; // Small offset so the popup is not right on your mouse
      const selection = window!.getSelection()!;
      setSelectedText({ selection, text: selection.toString(), location });
    }
  };

  const fromKeyUp = () => {
    if (typeof window.getSelection != 'undefined') {
      // The keyup does not give mouse coords, so we need to get the coords from the text we highlighted
      const selection = window!.getSelection()!;
      // The anchorNode is just a Node, so we need to get the parent element to get the rect
      const rect = selection.anchorNode?.parentElement!.getBoundingClientRect();
      const y = rect!.bottom + 5; // give small offset so its not touching the bottom of the element

      // We get the offset which is the character in the middle of our selection
      /** Example - 123456789 text
       * We select 456 -- 123[456]789
       * The values will be as follows:
       * textContent.legnth = 9
       * anchorOffset = 3
       * extentOffset = 6
       * middleOfSel = (6 - 3) / 2 = 1.5
       * half = 3 + middleOfSel = 4.5
       * textOffset = 4.5 / 9 = 0.5
       */

      //@ts-ignore extentOffset not a property on selection typeerror... but it is a property
      const middleOfSel = (selection.extentOffset - selection.anchorOffset) / 2;
      const half = selection.anchorOffset + middleOfSel;

      const textOffset = half / selection.anchorNode!.textContent!.length;
      const xOffset = rect!.width * textOffset;
      // We are trying to get as close as possible to the X position that is at the halfway point
      // in our selection. It's not in pixels, but it's close enough.

      const x = rect!.left + xOffset;
      setSelectedText({
        selection,
        text: selection.toString(),
        location: { x, y },
      });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('mouseup', fromMouseUp);
      containerRef.current.addEventListener('keyup', fromKeyUp);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mouseup', fromMouseUp);
        containerRef.current.removeEventListener('keyup', fromKeyUp);
      }
    };
  }, [containerRef]);

  useEffect(() => {
    const getContainer = () => {
      const container = document.querySelector('.custom-ce');
      container
        ? (containerRef.current = container)
        : setTimeout(getContainer, 100);
    };
    getContainer();
  }, []);

  return selectedText;
}
