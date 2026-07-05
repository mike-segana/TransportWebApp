import SideBar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/Topbar";

//file to define dashboard shell (Sidebar and Topbar)
//{children} is a placeholder for nested content
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode; //this is typescript so specifies type of children placeholder, it can be any valid react component
}) {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1">
                <TopBar />
                {/*{children} is the page content e.g. shipments page*/}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}