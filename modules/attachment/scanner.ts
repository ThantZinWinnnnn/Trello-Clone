import { ScanStatus } from "@prisma/client";

export type ScanInput = {
  storageKey: string;
  contentType: string;
  fileSize: number;
};

export interface AttachmentScanner {
  scan(input: ScanInput): Promise<ScanStatus>;
}

class StubAttachmentScanner implements AttachmentScanner {
  async scan(_input: ScanInput): Promise<ScanStatus> {
    const mode = (process.env.ATTACHMENT_SCAN_MODE ?? "clean").toLowerCase();

    if (mode === "infected") {
      return ScanStatus.INFECTED;
    }

    if (mode === "failed") {
      return ScanStatus.FAILED;
    }

    return ScanStatus.CLEAN;
  }
}

const scanner = new StubAttachmentScanner();

export const scanAttachment = async (input: ScanInput) => {
  return scanner.scan(input);
};
