'use client';
import type { ForwardedRef } from 'react';
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
  DirectiveDescriptor,
  directivesPlugin,
  frontmatterPlugin,
  imagePlugin,
  SandpackConfig,
  codeMirrorPlugin,
  sandpackPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  tablePlugin,
  InsertTable,
  ListsToggle,
  InsertThematicBreak,
  InsertCodeBlock,
  codeBlockPlugin,
  KitchenSinkToolbar,
  StrikeThroughSupSubToggles,
  linkDialogPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import SavePlugin from './save-plugin';
import './editor-styles.css';
// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps & {noteId?: string}) {
  console.log('props', props);
  console.log('1 editorRef', editorRef);

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

  return (
    <MDXEditor
    readOnly={!props.noteId}
    placeholder={!props.noteId ? 'Open a note to start editing' : 'Enter text...'}
      className="h-[calc(100%-48px)] relative"
      contentEditableClassName="custom-ce relative overflow-auto h-full p-4 text-foreground"
      plugins={[
        toolbarPlugin({
          toolbarClassName: 'custom-toolbar',
          toolbarContents: () => (
            <>
              <SavePlugin editorRef={editorRef} noteId={props.noteId} />
              {/* <UndoRedo />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <StrikeThroughSupSubToggles />
                <InsertCodeBlock />
                <InsertThematicBreak />
                <InsertTable /> */}
              <KitchenSinkToolbar />
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
