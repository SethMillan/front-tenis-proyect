"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  Plus, Home, DollarSign, Box, Users, User, TrendingUp, ChevronUp, Star, LogOut } from "lucide-react";

import { 
    Sidebar, 
    SidebarContent, 
    SidebarGroup, 
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter, 
} from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const items = [
    {
        title: "Nueva Venta",
        url: "#",
        icon: Plus,
    },
    {
        title: "Home",
        url: "/home",
        icon: Home,
    },
    {
        title: "Ventas",
        url: "/sales",
        icon: DollarSign,
    },
    {
        title: "Productos",
        url: "/products",
        icon: Box,
    },
    {
        title: "Clientes",
        url: "#",
        icon: Users,
    },
    {
        title: "Empleados",
        url: "/employees",
        icon: User,
    },
    {
        title: "Estadísticas",
        url: "#",
        icon: TrendingUp,
    },
];

export function AppSidebar() {
    const pathname = usePathname() || "";

    return (
        <Sidebar>
            <SidebarHeader className="">
                <div className="flex items-center gap-3 px-4 py-6">
                    <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center">
                        <Star className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-base font-semibold">Tenis <span className="font-medium">Sport LZC</span></p>
                        <p className="text-xs text-slate-500">Punto de venta</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="px-2">
                            {items.map((item) => {
                            const active = item.url !== "#" && pathname.startsWith(item.url);
                            const isSpecial = item.title === "Nueva Venta";
                            const Icon = item.icon;

                            const linkBase = "flex items-center gap-3 w-full px-3 py-6 rounded-lg transition-colors text-sm";
                            const linkClass = active
                                ? "bg-slate-500 text-slate-100 font-medium"
                                : isSpecial
                                ? "bg-blue-500 text-white" // "Nueva Venta" en azul por defecto
                                : "text-slate-700 hover:bg-slate-300"; 

                            const iconBase = "inline-flex items-center justify-center h-8 w-8 rounded-md";
                            const iconClass = active
                                ? "bg-slate-500 text-white"
                                : isSpecial
                                ? "bg-blue-500 text-white"
                                : "bg-transparent text-slate-600";

                            return (
                                <SidebarMenuItem key={item.title} className="my-1">
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className={[linkBase, linkClass].join(" ")}>
                                            <span className={[iconBase, iconClass].join(" ")}>
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="px-4 py-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full outline-none cursor-pointer">
                            <div className="flex items-center gap-3 w-full p-2 rounded-lg transition-colors hover:bg-slate-200">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-slate-700" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-medium">Administrador</div>
                                    <div className="text-xs text-slate-500">Ver perfil</div>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[280px] p-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Detalles de la cuenta</h3>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-sm text-slate-500">Nombre:</p>
                                        <p className="text-sm">Nombre</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Correo:</p>
                                        <p className="text-sm">correo@correo.com</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Teléfono:</p>
                                        <p className="text-sm">443 169 6969</p>
                                    </div>
                                </div>
                                <DropdownMenuItem className="w-full cursor-pointer" asChild>
                                    <Link href="/auth/login" className="flex items-center gap-2 text-red-500">
                                        <LogOut className="h-4 w-4" />
                                        <span>Cerrar sesión</span>
                                    </Link>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>

        </Sidebar>
    );
}