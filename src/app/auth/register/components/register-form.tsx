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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authService } from "@/feats/auth/auth-service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const registerSchema = z
  .object({
    email: z.string().trim().email({ message: "El correo no es válido" }),
    password: z.string().min(6, { message: "Debe tener al menos 6 caracteres" }),
    confirm_password: z.string(),
    nombre: z.string().min(2, { message: "Debe tener 2 caracteres como mínimo" }),
    apellido_p: z.string().min(2, { message: "Debe tener 2 caracteres como mínimo" }),
    apellido_m: z.string().min(2, { message: "Debe tener 2 caracteres como mínimo" }),
    rol: z.enum(["Admin", "Employee"], { message: "Rol inválido" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Las contraseñas no coinciden",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
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
      const { confirm_password, ...payload } = data; // no enviar confirm_password al backend
      const res = await authService.register(payload);
      if (!res.ok) {
        setError("Error al registrar el usuario");
                toast.error("Correo electrónico ya registrado", {
        toastId: "register-error",
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
      form.reset();
        toast.success("Usuario registrado correctamente", {
        toastId: "register-success",
        style: {
          backgroundColor: "#34D399",
          color: "#0F0F0F",
          fontSize: "16px",
          height: "45px",
          minHeight: "45px",
          maxHeight: "45px",        },
        closeButton: false,
});
      router.push("/auth/login");
    } catch (err) {
      setError("Error de conexión: " + String(err));
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
      console.log(String(err));
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
              <FormLabel className="text-xs dark:text-[#E0E0E0]">Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  className="!text-sm p-5 dark:placeholder-[#E0E0E0] dark:text-[#E0E0E0] dark:border-none"
                  placeholder="Escribe el correo electrónico"
                  type="email"
                  autoComplete="email"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs dark:text-[#E0E0E0]">Contraseña</FormLabel>
              <FormControl>
                <Input
                  className="!text-sm p-5 dark:placeholder-[#E0E0E0] dark:text-[#E0E0E0] dark:border-none"
                  placeholder="Escribe tu contraseña"
                  type="password"
                  autoComplete="new-password"
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
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs dark:text-[#E0E0E0]">Repite tu contraseña</FormLabel>
              <FormControl>
                <Input
                  className="!text-sm p-5 dark:placeholder-[#E0E0E0] dark:text-[#E0E0E0] dark:border-none"
                  placeholder="Repite tu contraseña"
                  type="password"
                  autoComplete="new-password"
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
              <FormLabel className="text-xs dark:text-[#E0E0E0]">Nombre completo</FormLabel>
              <FormControl>
                <Input
                  className="!text-sm p-5 dark:placeholder-[#E0E0E0] dark:text-[#E0E0E0] dark:border-none"
                  placeholder="Escribe el nombre, ej: Juan"
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
          name="apellido_p"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs dark:text-[#E0E0E0]">Apellido Paterno</FormLabel>
              <FormControl>
                <Input
                  className="!text-sm p-5 dark:placeholder-[#E0E0E0] dark:text-[#E0E0E0] dark:border-none"
                  placeholder="Escribe el apellido paterno, ej: Pérez"
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
              <FormLabel className="text-xs dark:text-[#E0E0E0]">Apellido Materno</FormLabel>
              <FormControl>
                <Input
                  className="!text-sm p-5 dark:placeholder-[#E0E0E0] dark:text-[#E0E0E0] dark:border-none"
                  placeholder="Escribe el apellido materno, ej: Martínez"
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
              <FormLabel className="text-xs dark:text-[#E0E0E0]">Rol del empleado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className="
                      !text-sm px-5 py-3
                      dark:text-[#E0E0E0] dark:border-none
                      [&>[data-placeholder]]:text-gray-400
                      dark:[&>[data-placeholder]]:text-[#E0E0E0]
                    "
                  >
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="!text-sm dark:text-[#E0E0E0] dark:border-none">
                  <SelectItem className="!text-sm px-5 py-2 dark:text-[#E0E0E0]" value="Admin">
                    Administrador
                  </SelectItem>
                  <SelectItem className="!text-sm px-5 py-2 dark:text-[#E0E0E0]" value="Employee">
                    Empleado
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <div className="flex justify-center">
        <Button
          className="dark:text-[#FFFFFF] !text-base bg-[#3188fd] hover:bg-[#72b9fe] px-8 py-6 cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registrar"}
        </Button>
      </div>

      <Button variant={"link"} asChild>
        <Link className="block text-sm pt-2 underline text-right !text-[#51a0fe]" href="/auth/login">
          Iniciar sesión
        </Link>
      </Button>
    </form>
  );
};

export default RegisterForm;