import React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatWindowLayout } from "@/components/chat/ChatWindowLayout";

export const ChatAppPage: React.FC = () => {

    return (
        <SidebarProvider>
            <AppSidebar />
            {/* Main content of the chat app would go here */}
            <div className="flex h-screen w-full p-2">
                <ChatWindowLayout />
            </div>
        </SidebarProvider>
    )
};