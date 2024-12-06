'use client';
import { type ForwardedRef } from 'react';
import {
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  diffSourcePlugin,
  AdmonitionDirectiveDescriptor,
  directivesPlugin,
  frontmatterPlugin,
  imagePlugin,
  SandpackConfig,
  codeMirrorPlugin,
  sandpackPlugin,
  toolbarPlugin,
  type MDXEditorMethods,
  // type MDXEditorProps,
  tablePlugin,
  codeBlockPlugin,
  linkDialogPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './editor-styles.css';
import { CustomToolbar } from './custom-toolbar';
import { Note } from '@/server/types';
import { useDbAdapter } from '@/server/dbAdapter';
import { debounce } from '@/lib/debounce';

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & {
  note: Note;
  userId: string;
}) {
  const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

  const virtuosoSampleSandpackConfig: SandpackConfig = {
    defaultPreset: 'react',
    presets: [
      {
        label: 'React',
        name: 'react',
        meta: 'live react',
        sandpackTemplate: 'react',
        sandpackTheme: 'light',
        snippetFileName: '/App.js',
        snippetLanguage: 'jsx',
        initialSnippetContent: defaultSnippetContent,
      },
      {
        label: 'React',
        name: 'react',
        meta: 'live',
        sandpackTemplate: 'react',
        sandpackTheme: 'light',
        snippetFileName: '/App.js',
        snippetLanguage: 'jsx',
        initialSnippetContent: defaultSnippetContent,
      },
    ],
  };

  const dbAdapter = useDbAdapter();

  const saveFile = debounce(async (markdown: string) => {
    if (props.note.id) {
      await dbAdapter.update('notes', { ...props.note, content: markdown });
    }
  }, 3000);
  const handleOnChange = (markdown: string) => {
    saveFile(markdown);
  };

  return (
    <MDXEditor
      readOnly={!props.note?.id}
      placeholder={
        !props.note?.id ? 'Open a note to start editing' : 'Enter text...'
      }
      markdown={props.note?.content || ''}
      onChange={handleOnChange}
      className="fixed top-12 w-full h-full md:h-[calc(100%-48px)] md:relative md:top-0"
      contentEditableClassName="custom-ce fixed h-[calc(100%-8rem)] md:top-0 md:relative md:h-full overflow-auto w-full p-4 text-foreground"
      plugins={[
        toolbarPlugin({
          toolbarClassName: 'custom-toolbar fixed top-12 md:top-0 md:relative',
          toolbarContents: () => (
            <>
              <CustomToolbar />
            </>
          ),
        }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageAutocompleteSuggestions: [
            'https://via.placeholder.com/150',
            'https://via.placeholder.com/150',
          ],
          imageUploadHandler: async () =>
            Promise.resolve('https://picsum.photos/200/300'),
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
        sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            css: 'CSS',
            txt: 'Plain Text',
            tsx: 'TypeScript',
            '': 'Unspecified',
          },
        }),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
        markdownShortcutPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
