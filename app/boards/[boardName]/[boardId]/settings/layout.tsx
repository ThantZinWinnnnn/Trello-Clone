import type { Metadata } from "next";

type Params = {
  boardName: string;
  boardId: string;
};

const toDisplayTitle = (boardName: string) =>
  decodeURIComponent(boardName).replace(/[-_]/g, " ").trim();

export function generateMetadata({
  params,
}: {
  params: Params;
}): Metadata {
  const label = toDisplayTitle(params.boardName) || "Board";
  const canonicalPath = `/boards/${params.boardName}/${params.boardId}/settings`;

  return {
    title: `${label} Settings`,
    description: `Manage settings for the ${label} board.`,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function BoardSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
