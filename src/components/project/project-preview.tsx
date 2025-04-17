import { prisma } from "@/lib/prisma";
import { ExternalLink } from "lucide-react";

interface ProjectPreviewProps {
    id?: string
}

const ProjectPreview = async ({ id }: ProjectPreviewProps) => {


    const project = await prisma.project.findUnique
        ({
            where: {
                id: id
            }
        })


            
    const projectlink = "https://tailwindcss.com/showcase"


    return ( 
        <div className="flex flex-col h-full border border-neutral-800 rounded-lg">
            <div className="flex items-center justify-between bg-black py-1 px-1.5 ">
                <h1>{project?.name}</h1>
                <ExternalLink size={18}/>
            </div>
            <iframe src={projectlink} className="w-full h-full "></iframe>
        </div>
     );
    }

export default ProjectPreview;