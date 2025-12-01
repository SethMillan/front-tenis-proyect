"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TableCustomers } from "@/components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
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

                if (typeof aValue === "string")
                    aValue = aValue.toLowerCase();
                if (typeof bValue === "string")
                    bValue = bValue.toLowerCase();

                const compare =
                    aValue > bValue ? 1 : aValue < bValue ? -1 : 0;

                return sortConfig.direction === "asc" ? compare : -compare;
            });
        }

        return data;
    }, [clientes, search, filters, sortConfig]);

    return (
        <>
            <div className="pt-1 h-full w-full flex flex-col gap-10 justify-center items-start m-8">
                <h1 className="text-2xl font-bold">Clientes</h1>

                <div className="flex items-center gap-5 w-full">
                    <div className="relative flex-1 w-full">
                        <Input
                            placeholder="Buscar clientes por nombre, teléfono o correo"
                            className="pl-10 cursor-pointer"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                        />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Filter className="h-4 w-4 cursor-pointer" /> Filtros
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
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder="Selecciona estado" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="todos" className="cursor-pointer">
                                                Todos
                                            </SelectItem>
                                            <SelectItem value="activos" className="cursor-pointer">
                                                Activos
                                            </SelectItem>
                                            <SelectItem value="inactivos" className="cursor-pointer">
                                                Inactivos
                                            </SelectItem>
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
                        <SelectTrigger className="w-[180px] cursor-pointer">
                            <SelectValue placeholder="Ordenar por:" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="id" className="cursor-pointer">
                                Por ID
                            </SelectItem>
                            <SelectItem value="nombre" className="cursor-pointer">
                                Por nombre (A-Z)
                            </SelectItem>
                            <SelectItem value="created_at" className="cursor-pointer">
                                Por fecha alta
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <TableCustomers data={processedCustomers} />
            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar
                limit={1}
            />
        </>
    );
}
