import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const useGetAttachments = (boardId: string, issueId?: string) => {
  return useQuery<AttachmentItem[]>({
    queryKey: ["attachments", boardId, issueId ?? "board"],
    queryFn: async () => {
      const query = new URLSearchParams({ boardId });
      if (issueId) {
        query.set("issueId", issueId);
      }
      const response = await axios.get(`/api/attachments?${query.toString()}`);
      return response.data;
    },
    enabled: Boolean(boardId),
  });
};

export const useUploadAttachment = (boardId: string, issueId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const signedUploadResponse = await axios.post("/api/attachments", {
        action: "createUpload",
        boardId,
        issueId,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      const signedUpload = signedUploadResponse.data as {
        uploadUrl: string;
        storageKey: string;
      };

      await axios.put(signedUpload.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const finalizeResponse = await axios.post("/api/attachments", {
        action: "finalizeUpload",
        boardId,
        issueId,
        storageKey: signedUpload.storageKey,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      });

      return finalizeResponse.data as AttachmentItem;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["attachments", boardId] }),
        queryClient.invalidateQueries({ queryKey: ["audit"] }),
      ]);
    },
    meta: {
      formatBytes,
    },
  });
};
