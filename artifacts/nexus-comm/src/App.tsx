import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import ChatPage from "@/pages/chat";
import NotFound from "@/pages/not-found";

import RoomsPage from "@/pages/rooms";
import NotificationsPage from "@/pages/notifications";
import CallsPage from "@/pages/calls";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function EmptyPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[500px]">
      <div className="text-center font-display border border-primary p-8 rounded-sm bg-primary/5 glow-primary max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary mb-4 glow-text-primary">{title}</h1>
        <p className="text-primary/70 font-mono text-sm uppercase tracking-widest">Module under construction</p>
        <div className="mt-8 h-1 w-full bg-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-primary animate-pulse w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/rooms" component={RoomsPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/calls" component={CallsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
