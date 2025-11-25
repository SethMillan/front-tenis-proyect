"use client"
import { Button } from '@/components/ui/button';
import { Categoria, Marca, Producto } from '@/types/types';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { useCategorias, useMarcas } from "@/hooks/useAPI";

const pageEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { marcas } = useMarcas();
    const { categorias } = useCategorias();
    const [product, setProduct] = useState<Producto | null>(null);

    return (
        <div className="p-8 w-full">
            <Link href={"/products"}>
                <Button variant="outline" className='cursor-pointer hover:bg-slate-500'>
                    <ArrowLeft />Atrás
                </Button>
            </Link>
            <div className='rounded-lg overflow-hidden border w-full mt-4 p-4'>
                <div className="flex flex-row gap-8">
                    {/* Contenedor de datos básicos */}
                    <div className="flex-1 flex flex-col gap-2">
                        <p className="text-s">Categoria:</p>
                        <Select>
                            <SelectTrigger className="w-[250px]">
                                <SelectValue placeholder="Selecciona la categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Categorias</SelectLabel>
                                {categorias?.map((cat: any) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nombre}</SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <p className="text-s">Nombre</p>
                        <Input 
                            placeholder="Nombre del producto"
                        />
                        
                    </div>
                    {/* Contenedor de datos extras */}
                    <div className="flex-1 flex flex-col gap-6 ">
                        <div className='flex flex-col gap-1'>
                            <h2 className="font-semibold text-2xl">Detalles del Producto</h2>
                            <p className="text-s">Marca:</p>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Selecciona la marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Marcas</SelectLabel>
                                    {marcas?.map((mar: any) => (
                                        <SelectItem key={mar.id} value={mar.id.toString()}>{mar.nombre}</SelectItem>
                                    ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p>Color:</p>
                            <Input 
                            placeholder="Nombre del producto"
                        />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <h2 className="font-semibold text-2xl">Tallas y cantidad</h2>
                            <div className="flex flex-row flex-wrap gap-2">
                                <div>
                                    <Dialog >
                                        <form>
                                            <DialogTrigger asChild>
                                            <Button variant="outline" className='w-28 h-20'> <Plus size={30}/>Agregar</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Agrega una talla</DialogTitle>
                                                <DialogDescription>
                                                Agrega una nueva talla con su respectiva cantidad al inventario del producto.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4">
                                                <div className="grid gap-3">
                                                <Label htmlFor="name-1">Talla</Label>
                                                <Input id="name-1" name="talla" defaultValue="Pedro Duarte" />
                                                </div>
                                                <div className="grid gap-3">
                                                <Label htmlFor="cantidad">Cantidad</Label>
                                                <Input id="cantidad" name="cantidad" defaultValue="0" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                            </DialogContent>
                                        </form>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default pageEdit;