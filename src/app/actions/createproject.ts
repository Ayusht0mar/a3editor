"use server";



import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toast } from "sonner";

export async function createProject(formData: FormData): Promise<void> {

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const session = await auth();

    if (!session) {
        throw new Error("Not authenticated");
    }

    if (!session.user) {
        throw new Error("No user found");
    }

    if (!name) {
        toast.error("Project name is required")
        return
    }

    const projectCount = await prisma.project.count({ where: { ownerId: session.user.id } });

    const project = await prisma.project.findMany({ where: { ownerId: session.user.id } });

    const projectNames = project.map((project) => project.name);

    const slug = name.toLowerCase().replaceAll(" ", "-");


    if (projectCount > 5) {
        toast.error("You can only have 5 projects")
        return
    }

    if (projectNames.includes(name)) {
        toast.error("Project name already exists")
        return
    }



    try {
        const project = await prisma.project.create({
            data: {
                name: name,
                slug,
                description:description,
                ownerId: session.user.id!,
            },
        });
    }
    catch (error) {
        toast.error("Can't create project")
    }
}