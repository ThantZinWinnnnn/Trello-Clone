import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  badRequest,
  forbidden,
  getAuthenticatedUserId,
  internalServerError,
  isNonEmptyString,
  requireBoardMember,
  sanitizePlainText,
  tooManyRequests,
  unauthorized,
} from "@/modules/shared/api.utils";
import { isRateLimited } from "@/modules/shared/rate-limit";

// Search users by name
export const GET = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`user:search:${authUserId}`, { limit: 120, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const url = new URL(req.url);
    const query = (url.searchParams.get("query") ?? "").trim();
    const boardId = (url.searchParams.get("boardId") ?? "").trim();

    if (boardId) {
      const member = await requireBoardMember(boardId, authUserId);
      if (!member) {
        return forbidden("You do not have access to this board");
      }
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
        ...(boardId
          ? {
              members: {
                none: {
                  boardId,
                },
              },
            }
          : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      take: 100,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch {
    return internalServerError("Error while fetching users");
  }
};

// Get unique assignees for a board
export const POST = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    if (isRateLimited(`user:update:${authUserId}`, { limit: 30, windowMs: 60_000 })) {
      return tooManyRequests();
    }

    const body = await req.json();
    const boardId = body?.boardId;

    if (!isNonEmptyString(boardId)) {
      return badRequest("boardId is required");
    }

    const member = await requireBoardMember(boardId, authUserId);
    if (!member) {
      return forbidden("You do not have access to this board");
    }

    const assignees = await prisma.assignee.findMany({
      where: {
        boardId,
      },
      select: {
        User: true,
      },
    });

    const users = assignees.reduce((userArr: UserProps[], assignee: any) => {
      const user = assignee.User;
      if (user && !userArr.find((item) => item.id === user.id)) {
        userArr.push(user);
      }
      return userArr;
    }, [] as UserProps[]);

    return NextResponse.json(users);
  } catch {
    return internalServerError("Error while fetching board users");
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const authUserId = await getAuthenticatedUserId();
    if (!authUserId) {
      return unauthorized();
    }

    const body: UpdateUserProps = await req.json();
    const { id, ...data } = body;

    if (!isNonEmptyString(id)) {
      return badRequest("id is required");
    }

    if (id !== authUserId) {
      return forbidden("You can only update your own user profile");
    }

    const sanitizedName =
      typeof data?.name === "string" ? sanitizePlainText(data.name) : undefined;
    const sanitizedImage =
      typeof data?.image === "string" ? data.image.trim() : undefined;

    const updateData: { name?: string; image?: string } = {};

    if (sanitizedName) {
      if (sanitizedName.length > 80) {
        return badRequest("Name must be 80 characters or fewer");
      }
      updateData.name = sanitizedName;
    }

    if (sanitizedImage) {
      const isSafeImageUrl = /^https?:\/\//i.test(sanitizedImage);
      if (!isSafeImageUrl) {
        return badRequest("Image must be a valid http(s) URL");
      }
      updateData.image = sanitizedImage;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch {
    return internalServerError("Error while updating user");
  }
};
