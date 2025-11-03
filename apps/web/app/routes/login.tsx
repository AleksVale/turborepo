import { DollarSign, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/hooks";

export default function Login() {
  const { login, isLoginLoading, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-foreground rounded-lg mb-4">
            <DollarSign className="w-7 h-7 text-background" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Lançamento Central
          </h1>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-1">
              Acesse sua conta
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie seus lançamentos em um só lugar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {loginError.message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Lembrar de mim
                </Label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Esqueci minha senha
              </a>
            </div>

            <Button
              type="submit"
              className="w-full font-medium"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
