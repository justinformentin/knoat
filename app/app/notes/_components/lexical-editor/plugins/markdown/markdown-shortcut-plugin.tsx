import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import * as React from 'react';

import { TRANSFORMERS } from './transformers';

export default function MarkdownPlugin(): JSX.Element {
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
}
