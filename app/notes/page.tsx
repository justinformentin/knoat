import { ForwardRefEditor } from './_components/markdown-editor/editor';
import { loadUser } from '@/lib/server/user';

export default async function NotePage() {
  await loadUser();

  return <ForwardRefEditor />;
}
