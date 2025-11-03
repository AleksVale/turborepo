import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks";
import { loginSchema, type LoginFormData } from "./login/validation";

export default function Login() {
  const { login, isLoginLoading, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    // @ts-expect-error - zodResolver type inference issue with optional fields
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
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

          <Form {...form}>
            <form
              // @ts-expect-error - React Hook Form type inference issue
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {loginError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {loginError.message}
                </div>
              )}

              <FormField
                // @ts-expect-error - Form control type inference issue
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-expect-error - Form control type inference issue
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          className="pr-10"
                          {...field}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  // @ts-expect-error - Form control type inference issue
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Lembrar de mim
                      </FormLabel>
                    </FormItem>
                  )}
                />
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
          </Form>
        </div>
      </div>
    </div>
  );
}
