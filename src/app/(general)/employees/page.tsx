"use client";

import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { TableEmployees } from "@/components/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const PageEmployees = () => {
    // Buscador
    const [searchTerm, setSearchTerm] = useState("");

    // Filtros
    const [filters, setFilters] = useState({
        rol: "",
        activo: "",
    });

    // Orden asc/desc por fecha de creación
    const [sortDirection, setSortDirection] = useState<"" | "asc" | "desc">("");

    return (
        <>
            <div className="pt-1 h-full w-full flex flex-col gap-10 justify-center items-start m-8">
                <h1 className="text-2xl font-bold">Empleados</h1>

                <div className="flex items-center gap-2">
                    {/* BUSCADOR */}
                    <div className="relative flex-1 w-lvh">
                        <Input
                            placeholder="Buscar empleados"
                            className="pl-10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    {/* FILTROS */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filtros
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Filtros de Empleados</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                {/* FILTRO POR ROL */}
                                <div className="flex flex-col gap-1">
                                    <label>Rol</label>
                                    <Select
                                        onValueChange={(value) =>
                                            setFilters((prev) => ({ ...prev, rol: value }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="todos">Todos</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Employee">Employee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* FILTRO POR ACTIVO */}
                                <div className="flex flex-col gap-1">
                                    <label>Estado</label>
                                    <Select
                                        onValueChange={(value) =>
                                            setFilters((prev) => ({ ...prev, activo: value }))
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

                    {/* ORDENAR */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Ordenar
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Ordenar Empleados</DialogTitle>
                            </DialogHeader>

                            <div className="grid gap-2 py-2">
                                <Button
                                    variant={sortDirection === "desc" ? "default" : "outline"}
                                    onClick={() => setSortDirection("desc")}
                                >
                                    Más recientes
                                </Button>

                                <Button
                                    variant={sortDirection === "asc" ? "default" : "outline"}
                                    onClick={() => setSortDirection("asc")}
                                >
                                    Más antiguos
                                </Button>

                                <Button variant="ghost" onClick={() => setSortDirection("")}>
                                    Limpiar
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* TABLA DE EMPLEADOS */}
                <TableEmployees
                    searchTerm={searchTerm}
                    filters={filters}
                    sortDirection={sortDirection}
                />
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={1}
                style={{
                    width: "clamp(280px, 90vw, 451px)",
                }}
            />
        </>
    );
};

export default PageEmployees;
