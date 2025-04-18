"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toast } from "sonner";

export async function deleteProject(projectId: string): Promise<void> {

    const session = await auth();

    if (!session) {
        throw new Error("Not authenticated");
    }

    if (!session.user) {
        throw new Error("No user found");
    }

    try {
        await prisma.project.delete({
            where: {
                id: projectId,
                ownerId: session.user.id,
            },
        });
    }
    catch (error) {
        toast.error("Failed to delete project")
    }
}