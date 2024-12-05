'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ListItem } from './list-item';
import { TodosList } from '@/lib/database.types';

type CompletedAccordionProps = {
  completed: TodosList;
  listIdx: number;
  deleteItem: any;
  handleCheck: any;
};

export const CompletedAccordion = ({
  completed,
  listIdx,
  deleteItem,
  handleCheck,
}: CompletedAccordionProps) => {
  return completed?.length ? (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="completed" className="border-0">
        <AccordionTrigger className="text-sm pl-1 pr-2">
          Completed {`(${completed.length})`}
        </AccordionTrigger>
        <AccordionContent>
          {completed.map((item) => {
            return (
              <ListItem
                key={item.id}
                item={item}
                inputDisabled
                className="border-0"
                inputClass="disabled:cursor-default disabled:opacity-100"
                onCheckedChange={(e: CheckedState) =>
                  handleCheck(e, listIdx, item.index!)
                }
                onDelete={() => deleteItem(listIdx, item.index!)}
              />
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : null;
};
