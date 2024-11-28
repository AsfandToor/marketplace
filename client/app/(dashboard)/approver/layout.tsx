"use client"

import { Sidebar } from "@/components/ui/sidebar"
import { LayoutDashboard, Package } from 'lucide-react'

const sidebarItems = [
  { name: "Dashboard", href: "/approver", icon: LayoutDashboard },
  { name: "Listings", href: "/approver/listings", icon: Package },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={sidebarItems} title="Marketplace (Approver)" />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}

