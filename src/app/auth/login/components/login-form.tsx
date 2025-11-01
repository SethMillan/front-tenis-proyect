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
import { toast, ToastContainer } from "react-toastify";

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
        setError("Usuario o contraseña equivocados"); 
        toast.error("Usuario o contraseña equivocados", {
        toastId: "login-error",
        style: {
          backgroundColor: "#F87171",
          color: "#0F0F0F", 
          fontSize: "16px",
          height: "45px",
          minHeight: "45px",
          maxHeight: "45px",
      },
        closeButton: false,
});

        return;
      }
        toast.success("Inicio de Sesión Exitoso  : :  Ingresando . . .", {
        toastId: "login-success",
        style: {
          backgroundColor: "#34D399",
          color: "#0F0F0F",
          fontSize: "16px",
          height: "45px",
          minHeight: "45px",
          maxHeight: "45px",        },
        closeButton: false,
});
      router.push("/home"); 
    } catch (err) {
      setError("Error de conexión: "+err); 
              toast.error("Error de conexión", {
        toastId: "connection-error",
        style: {
          backgroundColor: "#F87171",
          color: "#0F0F0F",
          fontSize: "16px",
          height: "45px",
          minHeight: "45px",
          maxHeight: "45px",
      },
        closeButton: false,
});

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
            <Input className="!text-sm p-5 dark:text-[#777979] dark:border-none" placeholder="Ingresa tu usuario" {...field} />
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
            <Input className="!text-sm p-5 dark:text-[#777979] dark:border-none" placeholder="Ingresa tu contraseña" type="password" {...field} />
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
      className="dark:text-[#333333] !text-lg bg-[#3188fd]  hover:bg-[#72b9fe] px-8 py-6 "
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