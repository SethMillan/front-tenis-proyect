"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/features/auth/auth-service";
import { toast } from "react-toastify";

const loginSchema = z.object({
  email: z.email({ message: "El email no es valido" }),
  password: z.string().min(6, { message: "Debe tener al menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const res = await authService.login(data);

      if (!res.ok) {
        toast.error("Usuario o contraseña incorrectos", {
          toastId: "login-error",
        });
        return;
      }

      toast.success("Inicio de sesión exitoso", {
        toastId: "login-success",
      });

      router.push("/home");
    } catch (error) {
      toast.error("Error de conexión con el servidor", {
        toastId: "login-connection-error",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
      <Form {...form}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs dark:text-[#E0E0E0]">
                Usuario
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ingresa tu usuario"
                  className="!text-sm p-5 dark:text-[#777979] dark:border-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <Form {...form}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs dark:text-[#E0E0E0]">
                Contraseña
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  className="!text-sm p-5 dark:text-[#777979] dark:border-none"
                />
              </FormControl>
              <FormMessage />
              <Link
                href="#"
                className="block text-sm pt-2 text-right text-[#3188fd] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </FormItem>
          )}
        />
      </Form>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#3188fd] hover:bg-[#72b9fe] px-8 py-6"
        >
          {isLoading ? "Iniciando sesión..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
