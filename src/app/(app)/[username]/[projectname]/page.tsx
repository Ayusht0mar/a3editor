import CodeEditor from "@/components/project/code-editor";
import ProjectPreview from "@/components/project/project-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileMenu from "@/components/user/profile-menu";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppWindowMac, CodeXml} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    username: string;
    projectname: string;
  };
}

const ProjectPage = async ({ params }: PageProps) => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return notFound();
  }

  const project = await prisma.project.findFirst({
    where: {
      slug: params.projectname,
      OR: [
        { ownerId: session.user.id },
        { collaborators: { some: { id: session.user.id } } }
      ]
    }
  });

  if (!project) {
    return notFound();
  }

  return (
    <div className="w-screen h-screen p-2">
      <Tabs defaultValue="codeeditor" className="h-full gap-1">
        <div className="flex justify-between items-center">
          <Image
            src="/brand/logo.svg"
            alt="logo"
            width={32}
            height={32}
          />
          <TabsList className="bg-transparent">
            <TabsTrigger value="codeeditor" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black flex gap-1.5 rounded">
              <CodeXml/>
              <p>Code</p>
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-gray-100 data-[state=active]:text-black flex gap-1.5 rounded">
              <AppWindowMac/>
              <p>Preview</p>
            </TabsTrigger>
          </TabsList>
          <UserProfileMenu/>
        </div>
        <TabsContent value="codeeditor">
          <CodeEditor projectName={project.name}/>
        </TabsContent>
        <TabsContent value="preview">
          <ProjectPreview id={project.id}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
 
export default ProjectPage;