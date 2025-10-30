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
<form onSubmit={onSubmit} className="flex flex-col gap-4 w-full ">
  <Form {...form}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs dark:text-[#E0E0E0]">Usuario</FormLabel>
          <FormControl >
            <Input className="!text-xs p-5 dark:text-[#777979]" placeholder="Ingresa tu usuario" {...field} />
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
          <FormLabel className="text-xs dark:text-[#E0E0E0] ">Contraseña</FormLabel>
          <FormControl>
            <Input className="!text-xs p-5 dark:text-[#777979]" placeholder="Ingresa tu contraseña" type="password" {...field} />
          </FormControl>
          <FormMessage />
          <Link 
            href="" 
            className="block text-sm pt-2  hover:underline text-right text-[#3188fd]"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </FormItem>
      )}
    />
  </Form>

  <div className="flex justify-center">
    <Button
      className="dark:text-[#333333] !text-xs bg-[#3188fd]  hover:bg-[#72b9fe] px-8 py-3 inline-block"
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? "Iniciando Sesión..." : "Login"}
    </Button>
  </div>
</form>

  );
};

export default RegisterForm;