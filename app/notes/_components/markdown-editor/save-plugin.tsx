import { Highlighter, Save } from 'lucide-react';
import { browserClient } from '@/utils/supabase/client';

export default function SavePlugin({
  editorRef,
  noteId,
}: {
  editorRef: any;
  noteId: any;
}): JSX.Element {
  console.log('editorRef', editorRef);
  const saveFile = async () => {
    const client = browserClient();

    const content = editorRef.current?.getMarkdown();
    console.log('content', content);
    if (noteId) {
      await client.from('notes').update({ content }).eq('id', noteId);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        className="action-button export"
        onClick={saveFile}
        title="Export"
        aria-label="Export editor state to JSON"
      >
        <Save className="h-5 w-5 mr-2" />
      </button>
    </div>
  );
}
