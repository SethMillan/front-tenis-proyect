"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Necesario para redireccionar al terminar
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Upload, X, Loader2 } from 'lucide-react';
import { useCategorias, useMarcas } from "@/hooks/useAPI";
import { createProduct, createTalla, uploadProductImage, createImagenProducto } from '@/lib/api';

// Interfaz local para el manejo del estado del formulario de tallas
interface TallaForm {
    talla: string;
    cantidad: string;
    precio_compra: string;
    precio_venta: string;
}

export default function CreateProductPage() {
    const router = useRouter();
    
    // Hooks de datos
    const { marcas } = useMarcas();
    const { categorias } = useCategorias();

    // Estados de Carga
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Estado para Datos del Producto (Paso 1)
    const [productData, setProductData] = useState({
        nombre: '',
        color: '',
        categoria_id: '',
        marca_id: ''
    });

    // 2. Estado para Imágenes (Paso 3 y 4)
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // 3. Estado para Tallas (Paso 2)
    const [tallas, setTallas] = useState<TallaForm[]>([]); 
    // Estado temporal para los inputs del Modal
    const [newTalla, setNewTalla] = useState<TallaForm>({
        talla: '', cantidad: '', precio_compra: '', precio_venta: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // --- MANEJADORES ---

    // Manejador de Inputs del Producto Principal
    const handleProductChange = (field: string, value: string) => {
        setProductData(prev => ({ ...prev, [field]: value }));
    };

    // Manejador de Imágenes
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImages(prev => [...prev, ...filesArray]);
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // Manejador de Tallas (Agregar al array local)
    const addTalla = () => {
        if (!newTalla.talla || !newTalla.cantidad || !newTalla.precio_compra || !newTalla.precio_venta) return;
        
        setTallas(prev => [...prev, newTalla]);
        setNewTalla({ talla: '', cantidad: '', precio_compra: '', precio_venta: '' }); // Reset form
        setIsDialogOpen(false); // Cerrar modal
    };

    // --- LÓGICA PRINCIPAL DE ENVÍO (LOS 4 PASOS) ---
    const handleSubmit = async () => {
        // Validaciones básicas antes de enviar
        if (!productData.nombre || !productData.marca_id || !productData.categoria_id) {
            alert("Por favor completa la información básica del producto");
            return;
        }
        if (tallas.length === 0) {
            alert("Debes agregar al menos una talla con sus precios.");
            return;
        }
        if (images.length === 0) {
            alert("Debes subir al menos una imagen.");
            return;
        }

        setIsSubmitting(true);

        try {
            // --- PASO 1: Crear Producto Maestro ---
            const productResponse = await createProduct({
                nombre: productData.nombre,
                color: productData.color,
                categoria_id: Number(productData.categoria_id),
                marca_id: Number(productData.marca_id)
            });

            // Obtenemos el ID del nuevo producto (basado en tu imagen_82e438)
            const newProductId = productResponse.id; 

            if (!newProductId) throw new Error("No se obtuvo ID del producto creado");

            // --- PASO 2: Crear Tallas (Iteramos sobre el array local) ---
            // Usamos Promise.all para guardar todas las tallas en paralelo
            await Promise.all(tallas.map(t => createTalla({
                producto_id: newProductId,
                talla: t.talla, // Puede ser string (ej. "27.5") o numero
                cantidad: Number(t.cantidad),
                precio_compra: Number(t.precio_compra),
                precio_venta: Number(t.precio_venta)
            })));

            // --- PASO 3 y 4: Subir Imágenes y Relacionarlas ---
            await Promise.all(images.map(async (file, index) => {
                // 3. Subir a Cloudinary
                const cloudResponse = await uploadProductImage(file);
                // Obtenemos url segura (basado en tu imagen_82e0b6)
                const imageUrl = cloudResponse.secure_url; 

                // 4. Crear Relación en BD
                await createImagenProducto({
                    producto_id: newProductId,
                    url: imageUrl,
                    es_principal: index === 0 // La primera imagen es la principal (True)
                });
            }));

            // Éxito total
            alert("Producto creado exitosamente");
            router.push('/products');

        } catch (error) {
            console.error("Error en el proceso de creación:", error);
            alert("Hubo un error al crear el producto. Revisa la consola.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Estilos visuales
    const mainImage = previews[0];
    const secondaryImages = previews.slice(1, 5);
    const hasSecondaryImages = secondaryImages.length > 0;

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            {/* Header simple */}
            <div className="mb-6">
                <Link href={"/products"}>
                    <Button variant="ghost" className='hover:bg-slate-100 flex items-center gap-2 pl-0 text-gray-600'>
                        <ArrowLeft size={20} /> Cancelar y volver
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* COLUMNA IZQUIERDA: Imágenes */}
                <div className="lg:col-span-7">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-xl">Galería del Producto</h2>
                        <label htmlFor="image-upload" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Plus size={16}/> Agregar imágenes
                        </label>
                        <input 
                            id="image-upload" type="file" multiple accept="image/*" className="hidden" 
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className={`h-[500px] md:h-[600px] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 relative group transition-all ${previews.length === 0 ? 'hover:border-gray-400' : ''}`}>
                        {previews.length === 0 ? (
                            <label htmlFor="image-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">Sube las fotos de tu producto</p>
                            </label>
                        ) : (
                            <div className={`grid grid-cols-1 ${hasSecondaryImages ? 'md:grid-cols-5' : ''} gap-2 h-full w-full p-2`}>
                                <div className={`relative h-full ${hasSecondaryImages ? 'md:col-span-3' : 'md:col-span-5'} rounded-lg overflow-hidden group`}>
                                    <img src={mainImage} className="w-full h-full object-cover" />
                                    <button onClick={() => removeImage(0)} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition">
                                        <X size={16}/>
                                    </button>
                                </div>
                                {hasSecondaryImages && (
                                    <div className="md:col-span-2 grid grid-cols-2 grid-rows-2 gap-2 h-full">
                                        {secondaryImages.map((src, idx) => (
                                            <div key={idx} className="relative h-full w-full rounded-lg overflow-hidden group">
                                                <img src={src} className="w-full h-full object-cover" />
                                                <button onClick={() => removeImage(idx + 1)} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition">
                                                    <X size={14}/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: Formulario */}
                <div className="lg:col-span-5 flex flex-col gap-8 py-2">
                    
                    <div className="space-y-6">
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Categoría</Label>
                            <Select onValueChange={(val) => handleProductChange('categoria_id', val)}>
                                <SelectTrigger className="w-full border-0 border-b border-gray-200 rounded-none px-0 focus:ring-0 text-gray-900 font-medium">
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categorías</SelectLabel>
                                        {categorias?.map((cat: any) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nombre}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            {/* Input ajustado como pediste (text-3xl) */}
                            <Input 
                                className="text-3xl md:text-4xl font-bold border-none px-0 shadow-none placeholder:text-gray-300 h-auto py-2 focus-visible:ring-0" 
                                placeholder="Nombre del producto"
                                value={productData.nombre}
                                onChange={(e) => handleProductChange('nombre', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <Label className="text-gray-600">Marca</Label>
                                <Select onValueChange={(val) => handleProductChange('marca_id', val)}>
                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="Marca..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {marcas?.map((mar: any) => (
                                            <SelectItem key={mar.id} value={mar.id.toString()}>{mar.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-600">Color Principal</Label>
                                <Input 
                                    className="bg-gray-50 border-gray-200" 
                                    placeholder="Ej. Negro" 
                                    value={productData.color}
                                    onChange={(e) => handleProductChange('color', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-8 border-t border-gray-100 mt-auto">
                        <div className="flex justify-between items-end">
                            <h2 className="font-semibold text-xl text-gray-900">Inventario y Precios</h2>
                            
                            {/* --- DIALOGO ACTUALIZADO CON PRECIOS --- */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-100">
                                        <Plus size={16}/> Agregar Talla
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Nueva Talla de Inventario</DialogTitle>
                                        <DialogDescription>
                                            Define la talla, stock inicial y los costos asociados.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-4">
                                        {/* Fila 1: Talla y Cantidad */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="talla">Talla</Label>
                                                <Input 
                                                    id="talla" placeholder="Ej. 27.5" 
                                                    value={newTalla.talla}
                                                    onChange={(e) => setNewTalla({...newTalla, talla: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cantidad">Stock Inicial</Label>
                                                <Input 
                                                    id="cantidad" type="number" placeholder="0" 
                                                    value={newTalla.cantidad}
                                                    onChange={(e) => setNewTalla({...newTalla, cantidad: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        {/* Fila 2: Precios (Nuevos campos) */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="compra">Precio Compra ($)</Label>
                                                <Input 
                                                    id="compra" type="number" placeholder="0.00" 
                                                    value={newTalla.precio_compra}
                                                    onChange={(e) => setNewTalla({...newTalla, precio_compra: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="venta">Precio Venta ($)</Label>
                                                <Input 
                                                    id="venta" type="number" placeholder="0.00" 
                                                    value={newTalla.precio_venta}
                                                    onChange={(e) => setNewTalla({...newTalla, precio_venta: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" onClick={addTalla}>Guardar Talla</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Lista visual de tallas agregadas */}
                        {tallas.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-100 rounded-lg p-6 flex flex-col items-center text-center text-gray-400">
                                <span className="text-sm">Agrega tallas para establecer precios e inventario</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {tallas.map((t, idx) => (
                                    <div key={idx} className="bg-white border p-3 rounded-lg text-sm shadow-sm relative group">
                                         <button onClick={() => setTallas(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 text-gray-300 hover:text-red-500">
                                            <X size={14}/>
                                        </button>
                                        <div className="font-bold text-gray-900">Talla: {t.talla}</div>
                                        <div className="text-gray-500">Stock: {t.cantidad}</div>
                                        <div className="text-xs text-green-600 font-medium mt-1">Venta: ${t.precio_venta}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-6">
                            <Button 
                                className="w-full h-12 text-lg font-medium bg-gray-900 hover:bg-black text-white"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando Producto...</>
                                ) : (
                                    "Crear Producto Final"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}