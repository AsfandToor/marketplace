"use client"

import { Sidebar } from "@/components/ui/sidebar"
import { LayoutDashboard, ShoppingCart, Package } from 'lucide-react'

const sidebarItems = [
  { name: "Dashboard", href: "/seller", icon: LayoutDashboard },
  { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
  { name: "Listings", href: "/seller/listings", icon: Package },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar items={sidebarItems} title="Marketplace (Seller)" />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}

