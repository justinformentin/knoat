'use client';

import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
  ChevronRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { useSelectedItemStore } from '@/lib/use-selected-item';

type TreeViewElement = {
  id: string;
  isSelectable?: boolean;
  children?: TreeViewElement[];
};

type TreeContextProps = {
  selectedId: string | undefined;
  expandedItems: string[] | undefined;
  indicator: boolean;
  handleExpand: (id: string) => void;
  selectItem: (id: string) => void;
  setExpandedItems?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  direction: 'rtl' | 'ltr';
};

const TreeContext = createContext<TreeContextProps | null>(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type Direction = 'rtl' | 'ltr' | undefined;

type TreeViewProps = {
  initialSelectedId?: string;
  indicator?: boolean;
  elements?: TreeViewElement[];
  initialExpandedItems?: string[];
  openIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
} & TreeViewComponentProps;

const Tree = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      dir,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState<string | undefined>(
      initialSelectedId
    );
    const [expandedItems, setExpandedItems] = useState<string[] | undefined>(
      initialExpandedItems
    );

    const selectItem = useCallback((id: string) => {
      setSelectedId(id);
    }, []);

    const handleExpand = useCallback((id: string) => {
      setExpandedItems((prev) => {
        if (prev?.includes(id)) {
          return prev.filter((item) => item !== id);
        }
        return [...(prev ?? []), id];
      });
    }, []);

    const expandSpecificTargetedElements = useCallback(
      (elements?: TreeViewElement[], selectId?: string) => {
        if (!elements || !selectId) return;
        const findParent = (
          currentElement: TreeViewElement,
          currentPath: string[] = []
        ) => {
          // const isSelectable = currentElement.isSelectable ?? true;
          //  Setting this as true because I don't want to have to add the isSelectable prop to all notes
          // I'm just assuming that will always be the case and we can go from there in the future
          const isSelectable = true;
          const newPath = [...currentPath, currentElement.id];
          if (currentElement.id === selectId) {
            if (isSelectable) {
              setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
            } else {
              if (newPath.includes(currentElement.id)) {
                newPath.pop();
                setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
              }
            }
            return;
          }
          if (
            isSelectable &&
            currentElement.children &&
            currentElement.children.length > 0
          ) {
            currentElement.children.forEach((child) => {
              findParent(child, newPath);
            });
          }
        };
        elements.forEach((element) => {
          findParent(element);
        });
      },
      []
    );

    useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId);
      }
    }, [initialSelectedId, elements]);

    const direction = dir === 'rtl' ? 'rtl' : 'ltr';

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          direction,
        }}
      >
        <div className={cn('size-full', className)}>
          <ScrollArea
            ref={ref}
            className="h-full relative px-2"
            dir={dir as Direction}
          >
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              defaultValue={expandedItems}
              value={expandedItems}
              className="flex flex-col gap-1"
              onValueChange={(value) =>
                setExpandedItems((prev) => [...(prev ?? []), value[0]])
              }
              dir={dir as Direction}
            >
              {children}
            </AccordionPrimitive.Root>
          </ScrollArea>
        </div>
      </TreeContext.Provider>
    );
  }
);

Tree.displayName = 'Tree';

const TreeIndicator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { direction } = useTree();

  return (
    <div
      dir={direction}
      ref={ref}
      className={cn(
        'h-full w-px bg-muted absolute left-[7px] rtl:right-[7px] py-3 rounded-md hover:bg-slate-300 duration-300 ease-in-out',
        className
      )}
      {...props}
    />
  );
});

TreeIndicator.displayName = 'TreeIndicator';

interface FolderComponentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

type FolderProps = {
  expandedItems?: string[];
  element: string;
  isSelectable?: boolean;
  isSelect?: boolean;
  item: any;
} & FolderComponentProps;

const Folder = forwardRef<
  HTMLDivElement,
  FolderProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      element,
      value,
      isSelectable = true,
      isSelect,
      item,
      children,
      ...props
    },
    ref
  ) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      setExpandedItems,
    } = useTree();

    const {setSelectedItem, selectedItem} = useSelectedItemStore(
      (state) => state
    );
    return (
      <AccordionPrimitive.Item
        {...props}
        value={value}
        className="relative overflow-hidden h-full "
      >
        <div className="flex py-1 md:py-0">
          <AccordionPrimitive.Trigger
            className={cn(
              `flex  gap-1 text-lg md:text-sm rounded-md`,
              className,
              {
                'bg-muted rounded-md pr-2': selectedItem?.id === value,
                'bg-[#e2ecfd] rounded-md': isSelect && isSelectable,
                'cursor-pointer': isSelectable,
                'cursor-not-allowed opacity-50': !isSelectable,
              }
            )}
            disabled={!isSelectable}
            onClick={() => {
              handleExpand(value);
              setSelectedItem(item);
            }}
          >
            <div className="flex items-center gap-1">
              <ChevronRight
                className={`size-4 opacity-50 transition-all ${expandedItems?.includes(value) ? 'rotate-90' : ''}`}
              />
              <span className="truncate">{element}</span>
            </div>
          </AccordionPrimitive.Trigger>
        </div>
        <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="flex flex-col gap-1 py-1 ml-4 rtl:mr-5 "
            defaultValue={expandedItems}
            value={expandedItems}
            onValueChange={(value) => {
              setExpandedItems?.((prev) => [...(prev ?? []), value[0]]);
            }}
          >
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  }
);

Folder.displayName = 'Folder';

const File = forwardRef<
  HTMLButtonElement,
  {
    value: string;
    isSelectable?: boolean;
    isSelect?: boolean;
    item: any;
  } & React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(
  (
    {
      value,
      className,
      isSelectable = true,
      isSelect,
      item,
      children,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem } = useTree();
    const {selectedItem, setSelectedItem} = useSelectedItemStore(
      (state) => state
    );

    const isSelected = isSelect ?? selectedId === value;
    return (
      <AccordionPrimitive.Item value={value} className="relative">
        <AccordionPrimitive.Trigger
          ref={ref}
          {...props}
          dir={direction}
          disabled={!isSelectable}
          aria-label="File"
          className={cn(
            'flex items-center gap-1 cursor-pointer text-lg md:text-sm pr-1 rtl:pl-1 rtl:pr-0 rounded-md duration-200 ease-in-out px-[5px] py-[2px]',
            {
              'bg-[#e2ecfd]': isSelected && isSelectable,
              'bg-muted rounded-md pr-2': selectedItem?.id === value,
            },
            isSelectable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed',
            className
          )}
          onClick={() => {
            selectItem(value);
            setSelectedItem(item);
          }}
        >
          {children}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Item>
    );
  }
);

File.displayName = 'File';

const CollapseButton = forwardRef<
  HTMLButtonElement,
  {
    elements: TreeViewElement[];
    expandAll?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>
>(({ className, elements, expandAll = false, children, ...props }, ref) => {
  const { expandedItems, setExpandedItems } = useTree();

  const expendAllTree = useCallback((elements: TreeViewElement[]) => {
    const expandTree = (element: TreeViewElement) => {
      const isSelectable = element.isSelectable ?? true;
      if (isSelectable && element.children && element.children.length > 0) {
        setExpandedItems?.((prev) => [...(prev ?? []), element.id]);
        element.children.forEach(expandTree);
      }
    };

    elements.forEach(expandTree);
  }, []);

  const closeAll = useCallback(() => {
    setExpandedItems?.([]);
  }, []);

  useEffect(() => {
    console.log(expandAll);
    if (expandAll) {
      expendAllTree(elements);
    }
  }, [expandAll]);

  return (
    <Button
      variant={'ghost'}
      className="h-8 w-fit p-1 absolute bottom-1 right-2"
      onClick={
        expandedItems && expandedItems.length > 0
          ? closeAll
          : () => expendAllTree(elements)
      }
      ref={ref}
      {...props}
    >
      {children}
      <span className="sr-only">Toggle</span>
    </Button>
  );
});

CollapseButton.displayName = 'CollapseButton';

export { CollapseButton, File, Folder, Tree, type TreeViewElement };
