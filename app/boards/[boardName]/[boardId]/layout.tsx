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
  const canonicalPath = `/boards/${params.boardName}/${params.boardId}`;

  return {
    title: `${label} Board`,
    description: `Manage issues and lists in the ${label} board.`,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${label} Board`,
      url: canonicalPath,
      type: "website",
    },
  };
}

export default function BoardDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
