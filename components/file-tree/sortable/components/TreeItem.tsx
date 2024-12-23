import React, { forwardRef, HTMLAttributes } from 'react';
import { ChevronDown, Dot } from 'lucide-react';
import { useSelectedItemStore } from '@/lib/use-selected-item';
import { UniqueIdentifier } from '@dnd-kit/core';

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indentationWidth: number;
  value: string;
  id: UniqueIdentifier;
  type?: 'note' | 'directory';
  onCollapse?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      collapsed,
      onCollapse,
      style,
      value,
      type,
      wrapperRef,
      id,
      ...props
    },
    ref
  ) => {
    const { selectedItem, setSelectedItem } = useSelectedItemStore(
      (state) => state
    );

    //@ts-ignore id is of type string, but dnd-kit gives us uniqueidentifier
    const handleItemClick = () => setSelectedItem({ id, label: value, type });

    return (
      <li
        id="tree-item"
        onClick={handleItemClick}
        className={
          'list-none box-border pr-1 mb-[-1px] rounded-md border-transparent ' +
          //   (selectedItem?.id === id ? 'bg-muted ' : '') +
          (disableInteraction ? 'pointer-events-none ' : '')
        }
        ref={wrapperRef}
        style={{ paddingLeft: `${indentationWidth * depth}px` }}
        {...props}
        {...handleProps}
      >
        <div
          className={
            'relative flex items-center py-[2px] pr-1 text-lg box-border rounded-md md:text-sm ' +
            (selectedItem?.id === id && !ghost ? 'bg-muted ' : '') +
            (clone ? 'pr-6  shadow-xl ' : '') +
            (ghost ? 'bg-[#87ceeb] border border-[#4682b4] border-dashed ' : '')
          }
          ref={ref}
          style={style}
        >
          {type === 'directory' ? (
            onCollapse ? (
              <ChevronDown
                onClick={onCollapse}
                className={`size-4 transition-transform ${collapsed ? '-rotate-90' : ''}`}
              />
            ) : (
              <Dot className="size-4 " />
            )
          ) : null}

          <span
            className={`grow pl-1 truncate ${disableSelection ? 'select-none' : ''}`}
          >
            {value}
          </span>
          {clone && childCount && childCount > 1 ? (
            <span
              //   className={styles.Count}
              className={`absolute top-[-10px] right-[-10px] flex items-center justify-center size-6 rounded-full bg-[#2389ff] text-xs font-semibold text-white ${disableSelection ? 'select-none' : ''}`}
            >
              {childCount}
            </span>
          ) : null}
        </div>
      </li>
    );
  }
);
