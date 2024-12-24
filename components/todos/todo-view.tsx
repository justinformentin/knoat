'use client';
import React, { ChangeEvent, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
} from '@hello-pangea/dnd';
import { CheckPlus } from '../ui/checkbox';
import { v4 as uuidv4 } from 'uuid';
import { Todos, TodosList } from '@/lib/database.types';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ListItem } from './list-item';
import { CompletedAccordion } from './completed-accordion';
import { AddTodo } from './add-todo';
import { Input } from '../ui/input';
import { debounce } from '@/lib/debounce';
import { X } from 'lucide-react';
import { useDataStore } from '@/lib/use-data';
import { useUpdateTodos } from '@/lib/db-adapter';

type DroppableType = { index: number; droppableId: string };

type DragEndResult = {
  // combine: string | null
  destination: { droppableId: string; index: number };
  draggableId: string;
  mode: string;
  reason: string;
  source: { droppableId: string; index: number };
  type: string;
};

const reorder = (list: TodosList, startIndex: number, endIndex: number) => {
  const result = Array.from(list.items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: TodosList,
  destination: TodosList,
  droppableSource: DroppableType,
  droppableDestination: DroppableType
) => {
  const sourceClone = Array.from(source.items);
  const destClone = Array.from(destination.items);

  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};
// const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggableStyle
): any => ({
  userSelect: 'none',
  // background: isDragging ? "lightgreen" : "grey",
  // styles we need to apply on draggables
  ...draggableStyle,
});
// const getListStyle = (isDraggingOver: boolean) => ({
//   background: isDraggingOver ? "lightblue" : "lightgrey",
// });

export default function TodoView({ initialTodos }: { initialTodos: Todos }) {
  const updateTodos = useUpdateTodos();

  const [state, setState] = useState<TodosList[]>(initialTodos.list);

  const [canDragElement, setCanDragElement] = useState('');
  const [status, setStatus] = useState('');

  const saveData = debounce(async () => {
    updateTodos({ ...initialTodos, list: state });
    setStatus('saved');
    setTimeout(() => setStatus(''), 2000);
  }, 3000);

  function onDragEnd(result: any | DragEndResult) {
    setCanDragElement('');
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) return;

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState: any = [...state];
      newState[sInd] = { ...newState[sInd], items };
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = { ...newState[sInd], items: result[sInd] };
      newState[dInd] = { ...newState[dInd], items: result[dInd] };
      setState(newState);
    }
    saveData();
  }

  const handleInputFocus = (itemId: string) => {
    setCanDragElement(itemId);
    const el = document.querySelector(`#${CSS.escape(itemId)}`);
    //@ts-ignore
    el.focus();
  };

  const updateState = (callback: (copy: TodosList[]) => any) => {
    const copy = [...state];
    callback(copy);
    setState(copy);
    saveData();
  };

  const handleContentChange = (evt: any, listIdx: number, itemId: string) =>
    updateState((copy) => {
      const found = copy[listIdx].items.find((item) => item.id === itemId);
      if (found) found.content = evt.target.value;
    });

  const handleCheck = (evt: any, listIdx: number, itemId: string) =>
    updateState((copy) => {
      const found = copy[listIdx].items.find((item) => item.id === itemId);
      if (found) found.completed = evt;
    });

  const addItem = (listIdx: number) => {
    const id = uuidv4();
    updateState((copy) =>
      copy[listIdx].items.splice(0, 0, { id, content: '', completed: false })
    );
    setTimeout(() => handleInputFocus(id), 150);
  };

  const deleteItem = (listIdx: number, itemId: string) =>
    updateState((copy) => {
      const foundIdx = copy[listIdx].items.findIndex(
        (item) => item.id === itemId
      );
      if (foundIdx !== -1) copy[listIdx].items.splice(foundIdx, 1);
    });

  const changeColumnTitle = (evt: any, listIdx: number) =>
    updateState((copy) => (copy[listIdx].title = evt.target.value));

  const deleteColumn = (listIdx: number) =>
    updateState((copy) => copy.splice(listIdx, 1));

  return (
    <>
      <div className="absolute top-2 left-1/2 text-sm">
        {status === 'saved' ? 'Saved...' : ''}
      </div>

      <div className="flex space-x-2 mt-2 ml-4">
        <AddTodo
          text="Add new group"
          className="bg-card"
          onClick={() => setState([...state, { title: '', items: [] }])}
        >
          <CheckPlus className="self-center ml-2" />
        </AddTodo>
      </div>
      <div
        className="w-full h-[calc(100%-42px)] grid overflow-x-auto gap-4 p-4"
        style={{
          gridTemplateColumns: `repeat(${state.length}, minmax(300px, 1fr))`,
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((column, ind) => {
            return (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    // style={getListStyle(snapshot.isDraggingOver)}
                    className={`relative border max-h-full h-fit rounded-lg min-w-[300px] px-2 pt-2 pb-12 bg-card shadow-md`}
                    {...provided.droppableProps}
                  >
                    <X
                      className="absolute top-2 right-2 h-3 w-3"
                      onClick={() => deleteColumn(ind)}
                    />
                    <Input
                      className="border-0 pl-2 text-base font-semibold bg-card hover:bg-muted"
                      value={column.title}
                      placeholder="Enter list name..."
                      onChange={(e) => changeColumnTitle(e, ind)}
                    />
                    <AddTodo
                      text="Add new task"
                      onClick={() => addItem(ind)}
                      className="w-full mb-2"
                    >
                      <CheckPlus className="self-center ml-2" />
                    </AddTodo>
                    <ScrollArea className="h-[calc(100%-42px)] pb-2">
                      {column?.items?.map((item, index) =>
                        !item.completed ? (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                            disableInteractiveElementBlocking={
                              item.id !== canDragElement
                            }
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <ListItem
                                  item={item}
                                  className="border"
                                  onKeyDownCapture={(e: any) =>
                                    e.key === 'Enter' && addItem(ind)
                                  }
                                  onClick={() => handleInputFocus(item.id)}
                                  onBlur={() => setCanDragElement('')}
                                  onDelete={() => deleteItem(ind, item.id)}
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                  ) => handleContentChange(e, ind, item.id)}
                                  onCheckedChange={(e: CheckedState) =>
                                    handleCheck(e, ind, item.id)
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        ) : null
                      )}

                      <ScrollBar forceMount />
                    </ScrollArea>
                    <CompletedAccordion
                      completed={column.items.filter(
                        (item) => item.completed === true
                      )}
                      listIdx={ind}
                      deleteItem={deleteItem}
                      handleCheck={handleCheck}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}
