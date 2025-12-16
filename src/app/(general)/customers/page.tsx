"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TableCustomers } from "@/components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, Search } from "lucide-react";
import { useClientes } from "@/hooks/useAPI";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function PageCustomers() {
    const { clientes, isLoading, isError } = useClientes();

    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ activo: "" });

    const [sortConfig, setSortConfig] = useState<{
        key: "id" | "nombre" | "created_at" | "";
        direction: "asc" | "desc";
    }>({
        key: "",
        direction: "asc",
    });

    const handleSort = (key: "id" | "nombre" | "created_at") => {
        setSortConfig((curr) => ({
            key,
            direction:
                curr.key === key && curr.direction === "asc" ? "desc" : "asc",
        }));
    };

    const processedCustomers = useMemo(() => {
        if (!clientes) return [];

        let data = [...clientes];

        if (search.trim() !== "") {
            const term = search.toLowerCase();
            data = data.filter((c) =>
                `${c.nombres} ${c.apellido_p} ${c.apellido_m ?? ""}`
                    .toLowerCase()
                    .includes(term)
            );
        }

        if (filters.activo === "activos") data = data.filter((c) => c.activo);
        if (filters.activo === "inactivos") data = data.filter((c) => !c.activo);

        if (sortConfig.key) {
            data.sort((a, b) => {
                const key = sortConfig.key;

                let aValue =
                    key === "nombre"
                        ? `${a.nombres} ${a.apellido_p}`
                        : a[key];
                let bValue =
                    key === "nombre"
                        ? `${b.nombres} ${b.apellido_p}`
                        : b[key];

                if (typeof aValue === "string") aValue = aValue.toLowerCase();
                if (typeof bValue === "string") bValue = bValue.toLowerCase();

                const compare =
                    aValue > bValue ? 1 : aValue < bValue ? -1 : 0;

                return sortConfig.direction === "asc" ? compare : -compare;
            });
        }

        return data;
    }, [clientes, search, filters, sortConfig]);

    if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 w-full">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Cargando clientes...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8 w-full text-red-500">
        <p>Error al cargar los clientes</p>
      </div>
    );
  }


    return (
        <>
            <div className="pt-1 h-full w-full flex flex-col gap-6 m-8">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-2xl font-bold">Clientes</h1>

                    <Link href="/customers/create">
                        <Button className="hover:bg-green-200 border-1 border-gray-200 bg-gray-50 text-gray-800">
                                                        Registrar Cliente
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-5 w-full">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Buscar clientes por nombre, teléfono o correo"
                            className="pl-10"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filtros
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Filtros de Clientes</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-1">
                                    <label>Estado</label>
                                    <Select
                                        onValueChange={(value) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                activo: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona estado" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="activos">Activos</SelectItem>
                                            <SelectItem value="inactivos">Inactivos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Select
                        onValueChange={(value) =>
                            handleSort(value as "id" | "nombre" | "created_at")
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Ordenar por:" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="id">Por ID</SelectItem>
                            <SelectItem value="nombre">Por nombre (A-Z)</SelectItem>
                            <SelectItem value="created_at">Por fecha alta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <TableCustomers data={processedCustomers} />
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={1}
                style={{
                    width: "451px",
                    minWidth: "451px",
                    maxWidth: "451px",
                }}
            />
        </>
    );
}
