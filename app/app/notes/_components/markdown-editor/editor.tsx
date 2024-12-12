'use client';
import dynamic from 'next/dynamic';
import { forwardRef, useRef } from 'react';
import { type MDXEditorMethods, 
  // type MDXEditorProps
 } from '@mdxeditor/editor';
import { Note } from '@/server/types';
// This is the only place InitializedMDXEditor is imported directly.
const MDXE = dynamic(() => import('./initialized-editor'), {
  // Make sure we turn SSR off
  ssr: false,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const ForwardRefEditor = forwardRef<{ note: Note, userId: string}>((props, ref) => {
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  //@ts-ignore - Will be fixed when changing the location of data loading and subsequent prop passing is fixed
  return <MDXE {...props} editorRef={mdxEditorRef} />;
});

// TS complains without the following line
ForwardRefEditor.displayName = 'ForwardRefEditor';
