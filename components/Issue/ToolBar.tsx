"use client";
import React from 'react'
import { type Editor } from '@tiptap/react';
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2
 }  from "lucide-react";
 import { Toggle } from '../ui/toggle';

 type Props = {
    editor: Editor | null;
 }

const ToolBar = ({editor}:Props) => {
    if(!editor){
        return null;
    };


  return (
    <section className='border border-input bg-transparent rounded-br-md rounded-bl-md p-1 flex flex-row items-center gap-1'>
        <Toggle
            size={"sm"}
            pressed={editor.isActive("heading")}
            onPressedChange={()=>editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
            <Heading2 className='w-4 h-4'/>
        </Toggle>
        <Toggle
            size={"sm"}
            pressed={editor.isActive("bold")}
            onPressedChange={()=>editor.chain().focus().toggleBold().run()}
        >
            <Bold className='w-4 h-4'/>
        </Toggle>
        <Toggle
            size={"sm"}
            pressed={editor.isActive("italic")}
            onPressedChange={()=>editor.chain().focus().toggleItalic().run()}
        >
            <Italic className='w-4 h-4'/>
        </Toggle>
        <Toggle
            size={"sm"}
            pressed={editor.isActive("strike")}
            onPressedChange={()=>editor.chain().focus().toggleStrike().run()}
        >
            <Strikethrough className='w-4 h-4'/>
        </Toggle>
        {/* <Toggle
            size={"sm"}
            pressed={editor.isActive("bulletList")}
            onPressedChange={()=>editor.chain().focus().toggleBulletList().run()}
        >
            <List className='w-4 h-4'/>
        </Toggle>
        <Toggle
            size={"sm"}
            pressed={editor.isActive("orderedList")}
            onPressedChange={()=>editor.chain().focus().toggleOrderedList().run()}
        >
            <ListOrdered className='w-4 h-4'/>
        </Toggle> */}
    </section>
  )
}

export default ToolBar