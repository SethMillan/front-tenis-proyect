"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createCliente } from "@/lib/api";

const PageCreateCliente = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [cliente, setCliente] = useState({
        nombres: "",
        apellido_p: "",
        apellido_m: "",
        telefono: "",
        email: "",
        fecha_nacimiento: "",
        password: "",
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!cliente.nombres || !cliente.apellido_p || !cliente.password) {
                toast.error(
                    "Nombre, apellido paterno y contraseña son obligatorios"
                );
                return;
            }

            await createCliente({
                nombres: cliente.nombres,
                apellido_p: cliente.apellido_p,
                apellido_m: cliente.apellido_m || null,
                telefono: cliente.telefono || null,
                email: cliente.email || null,
                fecha_nacimiento: cliente.fecha_nacimiento
                    ? new Date(cliente.fecha_nacimiento)
                    : null,
                password: cliente.password,
            });

            toast.success("Cliente creado correctamente");
            router.push("/customers");
        } catch (error: any) {
            toast.error(error.message || "Error al crear cliente");
        } finally {
            setLoading(false);
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
                <h1 className="text-2xl font-semibold mb-6">
                    Crear Cliente
                </h1>

                <div className="flex flex-row gap-10">
                    <div className="flex-1 flex flex-col gap-4">
                        <h2 className="font-semibold text-xl">
                            Datos personales
                        </h2>

                        <div className="flex flex-col gap-1">
                            <Label>Nombres *</Label>
                            <Input
                                placeholder="Nombre(s)"
                                value={cliente.nombres}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        nombres: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Apellido paterno *</Label>
                            <Input
                                placeholder="Apellido paterno"
                                value={cliente.apellido_p}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        apellido_p: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Apellido materno</Label>
                            <Input
                                placeholder="Apellido materno"
                                value={cliente.apellido_m}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        apellido_m: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Fecha de nacimiento</Label>
                            <Input
                                type="date"
                                value={cliente.fecha_nacimiento}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        fecha_nacimiento: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <h2 className="font-semibold text-xl">
                            Contacto y acceso
                        </h2>

                        <div className="flex flex-col gap-1">
                            <Label>Teléfono</Label>
                            <Input
                                placeholder="Teléfono"
                                value={cliente.telefono}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        telefono: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                placeholder="Correo electrónico"
                                value={cliente.email}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Contraseña *</Label>
                            <Input
                                type="password"
                                placeholder="Contraseña"
                                value={cliente.password}
                                onChange={(e) =>
                                    setCliente({
                                        ...cliente,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <Link href="/customers">
                        <Button variant="outline">
                            Cancelar
                        </Button>
                    </Link>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-500"
                    >
                        {loading ? "Guardando..." : "Guardar Cliente"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PageCreateCliente;
