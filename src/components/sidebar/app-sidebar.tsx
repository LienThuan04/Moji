"use client"

import * as React from "react"
import {
  Command,
  Moon,
  Sun,
} from "lucide-react"


import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { CreateNewChat } from "@/components/chat/CreateNewChat"
import { NewGroupChatModal } from "@/components/chat/NewGroupChatModal"
import { GroupChatList } from "@/components/chat/GroupChatList"
import { AddFriendModal } from "@/components/chat/AddFriendModal"
import { DirrectMessageList } from "@/components/chat/DirrectMessageList"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { toggleTheme } from "@/redux/slice/themeSlide"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isDark = useAppSelector(state => state.theme.isDark)
  const dispatch = useAppDispatch()
  return (
    <Sidebar variant="inset" {...props}>

      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="rounded-md px-3 py-2 bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 shadow-lg transform-gpu transition-all duration-200">
              <a href="#">
                <div className="flex w-full items-center px-2 justify-between">
                  <h2 className="text-4xl font-bold text-white">Moji</h2>
                  <div className="flex items-center gap-2">
                    <Sun className="size-4 text-white/80" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={() => dispatch(toggleTheme())}
                      className="data-[state=checked]:bg-background/80"
                    />
                    <Moon className="size-4 text-white/80" />
                  </div>
                </div>
              </a>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>

        {/* NewChat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group Chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Group Chats</SidebarGroupLabel>

          <SidebarGroupAction title="Create Group" className="cursor-pointer">
            <NewGroupChatModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <GroupChatList />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dirrect message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Dirrect Chats</SidebarGroupLabel>

          <SidebarGroupAction title="Add Friend" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <DirrectMessageList />
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
