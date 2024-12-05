'use client';
import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
} from '@hello-pangea/dnd';
import { Input } from '../ui/input';
import { Save, X } from 'lucide-react';
import { Checkbox, CheckPlus } from '../ui/checkbox';
import { v4 as uuidv4 } from 'uuid';
import { browserClient } from '@/utils/supabase/client';
import { Database, Todos, TodosList } from '@/lib/database.types';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

type DBTodo = Database['public']['Tables']['todos']['Row'];

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

const AddNewButton = ({
  text,
  children,
  onClick,
  className,
}: {
  text: string;
  children: any;
  onClick: any;
  className?: string;
}) => {
  return (
    <button
      type="button"
      onClick={onClick && onClick}
      className={
        'flex justify-around rounded-md border hover:bg-sky-50 ' +
        (className || '')
      }
    >
      {children}
      <div className="p-2 h-8 text-sm self-center border border-none w-full flex justify-start leading-[1.1rem]">
        {text}
      </div>
    </button>
  );
};

export const SaveButton = ({list, userId}:any) => {
  const [status, setStatus] = useState<'saving' | 'saved' | null>(null);
  const client = browserClient();
  const saveData = async () => {
    setStatus('saving');
    const res = await client
      .from('todos')
      .update({ list, user_id: userId })
      .eq('user_id', userId);
    setStatus('saved');
    setTimeout(()=>setStatus(null), 1000)
  };
  return (
    <AddNewButton
    text={status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : "Save Todos"}
    className="bg-white"
    onClick={saveData}
  >
    <Save className="self-center ml-2" />
  </AddNewButton>
  )
}
export default function TodoView({
  todos,
  userId,
}: {
  todos: DBTodo;
  userId: string;
}) {
  const [state, setState] = useState<Todos>(todos.list);

  const [canDragElement, setCanDragElement] = useState('');

  const client = browserClient();



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
    updateState((copy) => (copy[listIdx][itemIdx].checked = evt));

  const addItem = (listIdx: number) => {
    const id = uuidv4();
    updateState((copy) =>
      copy[listIdx].splice(0, 0, { id, content: '', checked: false })
    );
    setTimeout(() => handleInputFocus(id), 150);
  };

  const deleteItem = (listIdx: number, itemIdx: number) =>
    updateState((copy) => copy[listIdx].splice(itemIdx, 1));

  return (
    <>
      <div className="flex space-x-2 mt-2 ml-4">
        <AddNewButton
          text="Add new group"
          className="bg-white"
          onClick={() => setState([...state, []])}
        >
          <CheckPlus className="self-center ml-2" />
        </AddNewButton>
        <SaveButton list={state} userId={userId} />
      </div>

      <div className="w-full h-full flex overflow-x-auto space-x-4 p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{ width: `calc(100% / ${state.length})` }}
                  // style={getListStyle(snapshot.isDraggingOver)}
                  className={`border h-[calc(100%-42px)] rounded-lg min-w-[300px] px-2 pt-2 bg-white shadow-md`}
                  {...provided.droppableProps}
                >
                  <AddNewButton
                    text="Add new task"
                    onClick={() => addItem(ind)}
                    className="w-full mb-2"
                  >
                    <CheckPlus className="self-center ml-2" />
                  </AddNewButton>
                  <ScrollArea className="h-[calc(100%-42px)] pb-2">
                    {el.map((item, index) => (
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
                            <div className="flex justify-around rounded-md border focus-within:bg-sky-50 hover:bg-sky-50">
                              <Checkbox
                                checked={item.checked}
                                onCheckedChange={(e) =>
                                  handleCheck(e, ind, index)
                                }
                                className="self-center ml-2"
                              />
                              <Input
                                id={item.id}
                                value={item.content}
                                placeholder="Enter task"
                                className="p-2 h-8 bg-transparent outline-none border-none"
                                onClick={() => handleInputFocus(item.id)}
                                onBlur={() => setCanDragElement('')}
                                onChange={(e) =>
                                  handleContentChange(e, ind, index)
                                }
                              />
                              <button
                                type="button"
                                onClick={() => deleteItem(ind, index)}
                              >
                                <X className="h-4 w-4 mr-2" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    <ScrollBar forceMount />
                  </ScrollArea>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </>
  );
}
