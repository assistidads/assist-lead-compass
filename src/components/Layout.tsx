
import { useState } from 'react';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { BarChart3, Users, TrendingUp, Database, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: (props: { currentPage: string }) => React.ReactNode;
}

const menuItems = [
  { title: 'Dashboard', icon: BarChart3, path: 'dashboard' },
  { title: 'Data Prospek', icon: Users, path: 'prospek' },
  { title: 'Laporan', icon: TrendingUp, path: 'laporan' },
  { title: 'Data Master', icon: Database, path: 'master', adminOnly: true },
];

export function Layout({ children }: LayoutProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth';
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || profile?.role === 'admin'
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarContent className="bg-white">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Assist.id</h2>
              <p className="text-sm text-gray-600">Dashboard Leads</p>
            </div>
            
            <SidebarMenu className="p-4 space-y-2">
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={() => setCurrentPage(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      currentPage === item.path 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {filteredMenuItems.find(item => item.path === currentPage)?.title || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'Asia/Jakarta'
                })}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{profile?.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{profile?.full_name}</p>
                      <p className="text-sm text-gray-500 capitalize">{profile?.role?.replace('_', ' ')}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6">
            {children({ currentPage })}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
