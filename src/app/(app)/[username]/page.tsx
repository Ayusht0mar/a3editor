import { DashboardRedirect } from "@/components/auth/auth-redirect";
import Header from "@/components/dashboard/header";
import ProjectManager from "@/components/dashboard/projectmanager";
import DashboardSidebar from "@/components/dashboard/sidebar";

export default async function UserDashboadPage () {


    return ( 
        <div className="flex flex-col p-2 h-screen w-screen gap-2">
            <DashboardRedirect/>

            <Header/>
            <div className="flex h-full gap-2">
            <DashboardSidebar/>
            <ProjectManager/>
            </div>
        </div>
     );
}
 