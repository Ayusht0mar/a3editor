import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function ProjectManager() {

    const session = await auth()

    const projects = await prisma.project.findMany({
        where: {
            ownerId: session?.user.id
            
        }
    });

    return ( 
        <div className="border border-neutral-800 w-full h-full p-1.5 rounded-lg">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

{projects.length === 0 ? (
    <div className="col-span-full flex items-center justify-center h-32">
        <p className="text-neutral-500">No projects yet. Create one to get started!</p>
    </div>
) : (
    projects.map((project) =>
            <Link
                key={project.id} 
                href={`/${session?.user?.username}/${project.slug}`}
                className="border border-neutral-800 rounded-lg p-4 hover:bg-neutral-900 transition-colors"
            >
                <iframe src="https://tailwindcss.com/showcase" className="w-full aspect-video" ></iframe>
                <h3 className="font-medium">{project.name}</h3>
                {project.description && (
                    <p className="text-sm text-neutral-500 mt-2">{project.description}</p>
                )}
                <div className="mt-4 text-xs text-neutral-500">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
            </Link>
    )
)}

            <Link
                href={`/${session?.user?.username}/example`}
                className="border border-neutral-800 rounded-lg p-4 hover:bg-neutral-900 transition-colors"
            >
                <iframe src="https://tailwindcss.com/showcase" className="w-full aspect-video" ></iframe>
                <h3 className="font-medium">Example</h3>
                    <p className="text-sm text-neutral-500 mt-2">This is an example project.  </p>
                
                <div className="mt-4 text-xs text-neutral-500">
                </div>
            </Link>
</div>
        </div>
     );
}
 
export default ProjectManager;