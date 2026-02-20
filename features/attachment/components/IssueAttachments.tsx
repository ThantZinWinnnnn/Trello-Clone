"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAttachments, useUploadAttachment } from "@/features/attachment/hooks/attachment.hooks";

const MAX_ATTACHMENT_SIZE_MB = 10;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const statusClassMap: Record<AttachmentScanStatus, string> = {
  PENDING: "bg-amber-500 hover:bg-amber-500",
  CLEAN: "bg-emerald-600 hover:bg-emerald-600",
  INFECTED: "bg-red-600 hover:bg-red-600",
  FAILED: "bg-slate-600 hover:bg-slate-600",
};

const acceptedTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "text/plain",
].join(",");

const IssueAttachments = ({ boardId, issueId }: { boardId: string; issueId: string }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: attachments = [], isLoading } = useGetAttachments(boardId, issueId);
  const { mutate: uploadAttachment, isLoading: isUploading } = useUploadAttachment(
    boardId,
    issueId
  );

  const sorted = useMemo(
    () => attachments.slice(0).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [attachments]
  );

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type) {
      setErrorMessage("File type is required.");
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File size must be <= ${MAX_ATTACHMENT_SIZE_MB} MB.`);
      return;
    }

    setErrorMessage(null);
    uploadAttachment(file, {
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Attachment upload failed";
        setErrorMessage(message);
      },
    });

    event.target.value = "";
  };

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Attachments
        </p>
        <label className="inline-flex">
          <input
            type="file"
            className="hidden"
            onChange={onFileChange}
            accept={acceptedTypes}
            disabled={isUploading}
          />
          <Button type="button" size="sm" disabled={isUploading} asChild>
            <span>{isUploading ? "Uploading..." : "Upload"}</span>
          </Button>
        </label>
      </div>

      {errorMessage ? (
        <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
      ) : null}

      <div className="mt-3 space-y-2">
        {isLoading ? (
          <p className="text-xs text-slate-500">Loading attachments...</p>
        ) : sorted.length === 0 ? (
          <p className="text-xs text-slate-500">No attachments yet.</p>
        ) : (
          sorted.map((attachment) => (
            <article
              key={attachment.id}
              className="rounded-md border border-slate-200 p-2 text-xs dark:border-slate-700"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-medium">{attachment.fileName}</p>
                <Badge className={statusClassMap[attachment.scanStatus]}>
                  {attachment.scanStatus}
                </Badge>
              </div>
              <p className="mt-1 text-slate-500">
                {formatBytes(attachment.fileSize)} • {attachment.contentType}
              </p>
              <div className="mt-2 flex items-center justify-between text-slate-500">
                <p>
                  Uploaded by {attachment.uploader?.name ?? "Unknown"} on{" "}
                  {new Date(attachment.createdAt).toLocaleString()}
                </p>
                {attachment.scanStatus === "CLEAN" ? (
                  <a
                    className="text-blue-600 hover:underline"
                    href={`/api/attachments/${attachment.id}`}
                  >
                    Download
                  </a>
                ) : (
                  <span>Download blocked</span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default IssueAttachments;
