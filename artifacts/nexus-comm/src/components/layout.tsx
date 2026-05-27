import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User as UserIcon, MessageSquare, Globe, Bell, Phone, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, isAuthenticated, logoutLocal } = useAuth();

  const links = [
    { href: "/", label: "المركز", icon: Activity },
    { href: "/chat", label: "الاتصال", icon: MessageSquare },
    { href: "/rooms", label: "القنوات", icon: Globe },
    { href: "/notifications", label: "الإشعارات", icon: Bell },
    { href: "/calls", label: "المكالمات", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans scanline overflow-hidden">
      <header className="h-16 border-b border-primary/20 bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="cursor-pointer flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center rounded-sm glow-primary">
                <span className="font-display font-bold text-primary">N</span>
              </div>
              <span className="font-display font-bold text-xl tracking-wider text-primary glow-text-primary">
                NEXUS
              </span>
            </div>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = location === link.href;
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <Button 
                      variant={isActive ? "default" : "ghost"} 
                      className={`gap-2 ${isActive ? 'glow-primary text-primary-foreground font-bold' : 'text-foreground hover:text-primary hover:bg-primary/10'}`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-primary">{user.displayName || user.username}</span>
                <span className="text-xs text-primary/60 font-mono capitalize">{user.role} | {user.status}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-sm border border-primary/50 hover:bg-primary/20 glow-primary p-0">
                    <Avatar className="h-full w-full rounded-sm">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                      <AvatarFallback className="rounded-sm bg-background text-primary font-display">
                        <UserIcon className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-background ${user.status === 'online' ? 'bg-green-500 glow-accent' : user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-primary/50">
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/20 focus:text-destructive gap-2" onClick={logoutLocal}>
                    <LogOut className="w-4 h-4" />
                    خروج من النظام
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="text-primary font-mono text-xs opacity-50 animate-pulse">
              [ النظام في وضع الاستعداد ]
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 flex flex-col relative z-10 p-4 md:p-6 container mx-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
