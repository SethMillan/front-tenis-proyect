"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authService } from "@/features/auth/auth-service";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
  email: z.email({ message: "El email no es valido" }),
  password: z.string().min(6, { message: "Debe tener al menos 6 caracteres" }),
  nombre: z.string().min(2, { message: "Debe tener 2 caracteres como minimo" }),
  apellido_p: z
    .string()
    .min(2, { message: "Debe tener 2 caracteres como minimo" }),
  apellido_m: z
    .string()
    .min(2, { message: "Debe tener 2 caracteres como minimo" }),
  rol: z.enum(["Admin", "Employee"], { message: "Rol invalido" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  // * esto nos va a servir para navegar entre paginas jeje
  // * cosas como
  // * router.push("/dashboard")     router.back()     router.refresh()
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
      apellido_p: "",
      apellido_m: "",
      rol: "Employee",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      if (!res.ok) {
        setError("Credenciales incorrectas");
        alert("Error al registrar el usuario");
        return;
      }
      form.reset();
      alert("Usuario registrado correctamente");

      // * aqui nomas le agregue esto para redireccionar al login

      router.push("/auth/login");
    } catch (err) {
      alert("Error de conexion");
      setError("Error de conexión" + err);
      console.log(error.toString());
    } finally {
      // * aseguremonos de quitar el loading
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
      <Form {...form}>
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Escribe el nombre, ej:Juan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <Form {...form}>
        <FormField
          control={form.control}
          name="apellido_p"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido Paterno</FormLabel>
              <FormControl>
                <Input
                  placeholder="Escribe el apellido paterno, ej:Peréz"
                  {...field}
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
          name="apellido_m"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido Materno</FormLabel>
              <FormControl>
                <Input
                  placeholder="Escribe el apellido materno, ej:Martinez"
                  {...field}
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
          name="rol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol del empleado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Administrador</SelectItem>
                  <SelectItem value="Employee">Empleado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Registrando..." : "Registrar"}
      </Button>
      <Button variant={"link"} asChild>
        <Link href="/auth/login">Iniciar sesion</Link>
      </Button>
    </form>
  );
};

export default RegisterForm;
