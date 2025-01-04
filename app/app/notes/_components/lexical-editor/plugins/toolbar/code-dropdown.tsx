import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTriggerChevron,
} from '@/components/ui/dropdown-menu';
import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { useCallback } from 'react';
import { $getNodeByKey } from 'lexical';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

export function CodeDropdown({
  editor,
  disabled,
  selectedElementKey,
  codeLanguage,
}: any) {
  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTriggerChevron
        disabled={disabled}
        className="toolbar-item code-language"
      >
        <span className="text-xs">{getLanguageFriendlyName(codeLanguage)}</span>
      </DropdownMenuTriggerChevron>
      <DropdownMenuContent>
        <DropdownMenuArrow />
        {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
          return (
            <DropdownMenuItem
              className={`item ${value === codeLanguage ? 'dropdown-item-active' : ''}`}
              onClick={() => onCodeLanguageSelect(value)}
              key={value}
            >
              <span className="text">{name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
