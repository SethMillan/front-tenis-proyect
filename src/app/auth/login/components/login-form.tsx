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
import { authService } from "@/feats/auth/auth-service";

const loginSchema = z.object({
  email: z.email({ message: "El email no es valido" }),
  password: z.string().min(6, { message: "Debe tener al menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const RegisterForm = () => {
  // * esto nos va a servir para navegar entre paginas jeje
  // * cosas como
  // * router.push("/dashboard")     router.back()     router.refresh()
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError(""); 
    setIsLoading(true); 
    try {
      const res = await authService.login(data);
      if (!res.ok) {
        alert("Credenciales incorrectas");
        setError("Credenciales incorrectas"); 
        return;
      }
      alert("Inicio de sesion exitoso");
      router.push("/home"); 
    } catch (err) {
      setError("Error de conexión: "+err); 
      alert("Error de conexion");
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
              <FormLabel>Correo electronico</FormLabel>
              <FormControl>
                <Input placeholder="Escribe el correo electronico" {...field} />
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
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  placeholder="Escribe tu contraseña"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Iniciando Sesión..." : "Iniciar sesion"}
      </Button>
      <Button variant={"link"} asChild>
        <Link href="/auth/register">Registrarse</Link>
      </Button>
    </form>
  );
};

export default RegisterForm;
