"use client"
import React, { Dispatch, memo, useState } from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { I } from './CreateIssue';

const toolbarOptions = [
    ['bold', 'italic', 'underline',],        // toggled buttons
    ['blockquote'],
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['clean']                                         // remove formatting button
  ];
 

const InputTextEditor:React.FC<InputTextEditorProps> = ({val,dispatch}) => {
    // const [descValue, setDescValue] = useState<string | undefined>();
    const modules = {
        toolbar: toolbarOptions
      }
  return (
   <div>
     <ReactQuill theme="snow" modules={modules} value={val} onChange={(val)=> dispatch({type:"desc",value:val})} className='w-full '/>
   </div>
  )
}

export default memo(InputTextEditor);

interface InputTextEditorProps{
  val:string,
  dispatch:Dispatch<I>
}