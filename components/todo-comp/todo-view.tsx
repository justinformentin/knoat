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
import { Database, Todo, Todos, TodosList } from '@/lib/database.types';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ListItem } from './list-item';
import { CompletedAccordion } from './completed-accordion';
import { SaveTodo } from './save-todo';
import { AddTodo } from './add-todo';

type DBTodo = Database['public']['Tables']['todos']['Row'];

type DroppableType = { index: number; droppableId: string };

type ReducedList = { active: TodosList; completed: TodosList };

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
  console.log('REORDER list', list);
  const result = Array.from(list);
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
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

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

export default function TodoView({
  todos,
  userId,
}: {
  todos: DBTodo | null;
  userId: string;
}) {
  const initialTodos = !!todos?.list;
  const [state, setState] = useState<Todos | [[]]>(todos?.list || [[]]);

  const [canDragElement, setCanDragElement] = useState('');

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
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }

  const handleInputFocus = (itemId: string) => {
    setCanDragElement(itemId);
    const el = document.querySelector(`#${CSS.escape(itemId)}`);
    //@ts-ignore
    el.focus();
  };

  const updateState = (callback: (copy: Todos) => any) => {
    const copy = [...state];
    callback(copy);
    setState(copy);
  };

  const handleContentChange = (evt: any, listIdx: number, itemIdx: number) =>
    updateState((copy) => (copy[listIdx][itemIdx].content = evt.target.value));

  const handleCheck = (evt: any, listIdx: number, itemIdx: number) =>
    updateState((copy) => (copy[listIdx][itemIdx].completed = evt));

  const addItem = (listIdx: number) => {
    const id = uuidv4();
    updateState((copy) =>
      copy[listIdx].splice(0, 0, { id, content: '', completed: false })
    );
    setTimeout(() => handleInputFocus(id), 150);
  };

  const deleteItem = (listIdx: number, itemIdx: number) =>
    updateState((copy) => copy[listIdx].splice(itemIdx, 1));

  return (
    <>
      <div className="flex space-x-2 mt-2 ml-4">
        <AddTodo
          text="Add new group"
          className="bg-white"
          onClick={() => setState([...state, []])}
        >
          <CheckPlus className="self-center ml-2" />
        </AddTodo>
        <SaveTodo list={state} initialTodos={initialTodos} userId={userId} />
      </div>

      <div className="w-full h-full flex overflow-x-auto space-x-4 p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => {

            const { active, completed }: ReducedList = el.reduce(
              (curr: ReducedList, acc: Todo, currIdx: number) => {
                const key = acc.completed ? 'completed' : 'active';
                curr[key].push({ ...acc, index: currIdx });
                return curr;
              },
              { active: [], completed: [] }
            );

            return (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{ width: `calc(100% / ${state.length})` }}
                    // style={getListStyle(snapshot.isDraggingOver)}
                    className={`border h-[calc(100%-42px)] rounded-lg min-w-[300px] px-2 pt-2 bg-white shadow-md`}
                    {...provided.droppableProps}
                  >
                    <AddTodo
                      text="Add new task"
                      onClick={() => addItem(ind)}
                      className="w-full mb-2"
                    >
                      <CheckPlus className="self-center ml-2" />
                    </AddTodo>
                    <ScrollArea className="h-[calc(100%-42px)] pb-2">
                      {active.map((item, index) => (
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
                                onClick={() => handleInputFocus(item.id)}
                                onBlur={() => setCanDragElement('')}
                                onDelete={() => deleteItem(ind, index)}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  handleContentChange(e, ind, index)
                                }
                                onCheckedChange={(e: CheckedState) =>
                                  handleCheck(e, ind, index)
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}

                      <CompletedAccordion
                        completed={completed}
                        listIdx={ind}
                        deleteItem={deleteItem}
                        handleCheck={handleCheck}
                      />

                      <ScrollBar forceMount />
                    </ScrollArea>

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
