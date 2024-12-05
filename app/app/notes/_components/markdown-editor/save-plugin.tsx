import { Save } from 'lucide-react';
import { useDbAdapter } from '@/server/dbAdapter';

export default function SavePlugin({
  editorRef,
  note,
}: {
  editorRef: any;
  note: any;
}): JSX.Element {
  const dbAdapter = useDbAdapter();
  const saveFile = async () => {
    const content = editorRef.current?.getMarkdown();
    if (note.id) {
      // await client.from('notes').update({ content }).eq('id', note.id);
      // const updated = (await indexDb).update('notes', {...note, content})
      const updated = await dbAdapter.update('notes', { ...note, content });
      console.log('updated', updated);
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
