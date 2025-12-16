"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createCliente } from "@/lib/api";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const createClienteSchema = z.object({
  nombres: z.string().min(2, { message: "Debe tener al menos 2 caracteres" }),
  apellido_p: z.string().min(2, { message: "Debe tener al menos 2 caracteres" }),
  apellido_m: z.string().optional(),

  telefono: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{10,15}$/.test(val),
      "El teléfono debe tener entre 10 y 15 dígitos"
    ),

  email: z.string().email("El correo no es válido").optional(),

  fecha_nacimiento: z.string().optional(),

  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

type CreateClienteForm = z.infer<typeof createClienteSchema>;

const PageCreateCliente = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClienteForm>({
    resolver: zodResolver(createClienteSchema),
  });

  const onSubmit = async (data: CreateClienteForm) => {
    try {
      await createCliente({
        ...data,
        activo: true,
      });

      toast.success("Cliente creado correctamente");
      router.push("/customers");
    } catch (error: any) {
      toast.error(error.message || "Error al crear cliente");
    }
  };

  return (
    <div className="p-8 w-full">
      <Link href="/customers">
        <Button
          variant="outline"
          className="cursor-pointer hover:bg-slate-500 flex gap-2"
        >
          <ArrowLeft />
          Atrás
        </Button>
      </Link>

      <div className="rounded-lg overflow-hidden border w-full mt-4 p-6">
        <h1 className="text-2xl font-semibold mb-6">Crear Cliente</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-10">
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="font-semibold text-xl">Datos personales</h2>

              <div>
                <Label>Nombres *</Label>
                <Input {...register("nombres")} />
                {errors.nombres && (
                  <p className="text-red-500 text-sm">
                    {errors.nombres.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Apellido paterno *</Label>
                <Input {...register("apellido_p")} />
                {errors.apellido_p && (
                  <p className="text-red-500 text-sm">
                    {errors.apellido_p.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Apellido materno</Label>
                <Input {...register("apellido_m")} />
              </div>

              <div>
                <Label>Fecha de nacimiento</Label>
                <Input type="date" {...register("fecha_nacimiento")} />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <h2 className="font-semibold text-xl">Contacto y acceso</h2>

              <div>
                <Label>Teléfono</Label>
                <Input {...register("telefono")} />
                {errors.telefono && (
                  <p className="text-red-500 text-sm">
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Contraseña *</Label>
                <Input type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Link href="/customers">
              <Button variant="outline">Cancelar</Button>
            </Link>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-500"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageCreateCliente;
