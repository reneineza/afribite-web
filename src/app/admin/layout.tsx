import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, MessageSquare, ChefHat } from 'lucide-react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <Link href="/admin" className="font-bold text-xl text-sidebar-primary">AfriBite Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
            <LayoutDashboard className="h-5 w-5 text-sidebar-primary" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
            <Package className="h-5 w-5 text-sidebar-primary" />
            Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
            <ShoppingCart className="h-5 w-5 text-sidebar-primary" />
            Orders
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
            <Users className="h-5 w-5 text-sidebar-primary" />
            Customers
          </Link>
          <Link href="/admin/recipes" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
            <ChefHat className="h-5 w-5 text-sidebar-primary" />
            Recipes
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
            <MessageSquare className="h-5 w-5 text-sidebar-primary" />
            Messages
          </Link>
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors">
            <Settings className="h-5 w-5 text-sidebar-primary" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-end px-6 border-b border-border bg-background">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Admin User</span>
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>
        <div className="p-6 md:p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
