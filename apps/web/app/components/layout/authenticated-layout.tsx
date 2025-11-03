import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Produtos", href: "/produtos", icon: Package },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export default function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-base font-bold text-primary-foreground">
              L
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              Lançamento Central
            </span>
            <span className="text-xs text-muted-foreground">Plano Pro</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <Separator />

        <div className="space-y-2 p-4">
          <ModeToggle />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-border bg-card px-4 lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-border px-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <span className="text-base font-bold text-primary-foreground">
                      L
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      Lançamento Central
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Plano Pro
                    </span>
                  </div>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </NavLink>
                  ))}
                </nav>

                <Separator />

                <div className="space-y-2 p-4">
                  <ModeToggle />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="ml-4 flex flex-1 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                L
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                Lançamento Central
              </span>
              <span className="text-xs text-muted-foreground">Plano Pro</span>
            </div>
          </div>

          <ModeToggle />
        </header>

        <main className="flex-1 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
