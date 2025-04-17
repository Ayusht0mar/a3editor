"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner"


const DashboardSidebar = () => {

    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Project name is required")
            return
          }

        try {
            setIsLoading(true);
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            })
            

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to create project")
            }
            toast.success("Project created successfully")
            router.push(`/${data.user.username}/${data.id}`)
            } catch {
                toast.error("Failed to create project")
            } finally {
                setIsLoading(false);
            }
    }

    return ( 
        <div className="border border-neutral-800 h-full p-1.5 rounded-lg">
                  <div className="flex flex-col gap-2">
                    {/* Start from scratch  */}
                    <Dialog>
                        <DialogTrigger className="bg-neutral-900 py-1 px-3 rounded text-nowrap">
                                Start from Scratch
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Start from Scratch</DialogTitle>
                                <DialogDescription>Start with a clean slate and build your project from scratch</DialogDescription>
                            </DialogHeader>
                            <div>

                                <div className="flex flex-col gap-4 mb-8">
                                    <Label>Project Name</Label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" className="w-full"/>
                                </div>

                                <div className="flex flex-col gap-4 mb-8">
                                    <Label>Description (optional)</Label>
                                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full"/>
                                </div>
                                
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={handleCreate} disabled={isLoading}>Create Project</Button>
                            </DialogFooter>

                        </DialogContent>
                    </Dialog>
                    {/* Start from template  */}
                    <Dialog>
                        <DialogTrigger className="bg-neutral-900 py-1 px-3 rounded text-nowrap">
                                Start from Template
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Start from Template</DialogTitle>
                                <DialogDescription>Start with a pre-built template to speed up development</DialogDescription>
                            </DialogHeader>
                            <div>
                                <div className="flex flex-col gap-4 mb-8">
                                    <Label>Project Name</Label>
                                    <Input placeholder="Project Name" className="w-full"/>
                                </div>
                                <div className="flex flex-col gap-4 mb-8">
                                    <Label>Description (optional)</Label>
                                    <Input placeholder="Description" className="w-full"/>
                                </div>           
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div>
                                        <p>React</p>
                                    </div>
                                    <div>
                                        <p>Next.js</p>
                                    </div>
                                    <div>
                                        <p>Vue</p>
                                    </div>
                                    <div>
                                        <p>Nuxt</p>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {/* Clone from Github  */}
                    <Dialog>
                        <DialogTrigger className="bg-neutral-900 py-1 px-3 rounded text-nowrap">
                                Clone from Github
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Clone from Github</DialogTitle>
                                <DialogDescription>Clone an existing repository from GitHub</DialogDescription>
                            </DialogHeader>
                            <div>
                                <div className="flex flex-col gap-4 mb-8">
                                    <Label>Project Name</Label>
                                    <Input placeholder="Project Name" className="w-full"/>
                                </div>
                                <div className="flex flex-col gap-4 mb-8">
                                    <Label>Description (optional)</Label>
                                    <Input placeholder="Description" className="w-full"/>
                                </div>
                                <div className="flex flex-col gap-4 mb-8">
                                    <Label>Repository URL</Label>
                                    <Input placeholder="Repository URL" className="w-full"/>
                                </div>
                            </div>
                        <DialogFooter>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
        </div>
     );
}
 
export default DashboardSidebar;