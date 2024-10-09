"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Dispatch } from "react";
import { I } from "./CreateIssue";
import ToolBar from "./ToolBar";

export default function RichText({
  description,
  dispatch,
}: {
  description: string;
  dispatch: Dispatch<I>;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: description,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-background px-3 py-2 my-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate: ({ editor }) => {
      dispatch({ type: "desc", value: editor.getHTML() });
    },
  });

  return (
    <section className="flex flex-col justify-stretch min-h-[200px]">
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </section>
  );
}
