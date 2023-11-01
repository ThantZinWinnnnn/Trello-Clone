"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ReadOnlyRichText = ({ description }: { description: string }) => {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: description,
    editorProps: {
      attributes: {
        class:
          "rounded-md border-none bg-background py-1 my-0 text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 disabled",
      },
    },
  });
  return <section>
    <EditorContent editor={editor} />
  </section>
};

export default ReadOnlyRichText;
