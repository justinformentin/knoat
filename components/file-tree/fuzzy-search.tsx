'use client';

import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import Link from 'next/link';
import { useDataStore } from '@/lib/use-data';
import { findPathById } from '@/lib/find-note-path-by-id';
import { useSelectedItemStore } from '@/lib/use-selected-item';

export function FuzzySearch() {
  const notes = useDataStore((state) => state.notes);
  const directory = useDataStore((state) => state.directory);
  const setSelectedItem = useSelectedItemStore(
    (state) => state.setSelectedItem
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  //   const client = browserClient();
  //   const searchContent = debounce(async (e) => {
  //     setLoading(true);
  //     const query = `'${e.split(' ').join("' | '")}'`;
  //     const { data, error } = await client
  //       .from('notes')
  //       .select()
  //       .textSearch('fts', query);

  //     console.log('SEARCH data', data);
  //     console.log('search error', error);
  //   }, 2000);

  //   const inputSearch = (e) => {
  //     searchContent(e.target.value);
  //   };

  return (
    <>
      <div className="w-full flex-1">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center transition-colors border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-md text-sm text-muted-foreground"
        >
          <span className="inline-flex">Search notes</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for notes" />
        <CommandList>
          <CommandEmpty>No notes found.</CommandEmpty>
          <CommandGroup heading="Notes">
            {notes.map((note) => (
              <CommandItem key={note.id}>
                <Link
                  href={'/app/notes/#' + findPathById(directory.tree, note.id)}
                  onClick={() => {
                    setSelectedItem({ ...note, type: 'note' });
                    setOpen(false);
                  }}
                >
                  <span>{note.label}</span>
                  {/* Adding the content as hidden so Command will filter results based on content instead of just title */}
                  <span className="hidden">{note.content}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
