import React, { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          {children}
        </SidebarProvider>
    </div>
  )
}

export default layout