import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Save } from 'lucide-react';
import { browserClient } from '@/utils/supabase/client';

export default function ActionsPlugin({
  noteId,
  user,
}: {
  noteId: string;
  user: any;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const saveFile = async () => {
    const client = browserClient();

    const content = JSON.stringify(editor.getEditorState());

    if (noteId) {
      await client.from('notes').update({ content }).eq('id', noteId);
    } else {
      await client.from('notes').insert({
        user_id: user.id,
        full_path: window.location.hash.replace('#', ''),
        content,
        label: window.location.hash.split('/').slice(-1),
      });
    }
  };

  return (
    <div className="actions">
      <button
        className="action-button export"
        onClick={saveFile}
        title="Export"
        aria-label="Export editor state to JSON"
      >
        <Save className="h-4 w-4" />
      </button>
    </div>
  );
}
