"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Upload, X, Loader2, Save, Trash2 } from 'lucide-react';
import { useTenisById, useMarcas, useCategorias } from "@/hooks/useAPI";
import { createTalla, uploadProductImage, createImagenProducto, updateProduct,
    deleteImagenProducto, deleteTalla, deleteProduct
} from '@/lib/api';

export default function EditProductPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    // 1. Hooks de API
    const { tenis, isLoading, isError } = useTenisById(id);
    const { marcas } = useMarcas();
    const { categorias } = useCategorias();

    // 2. Estados Locales (Para editar)
    const [formData, setFormData] = useState({
        nombre: '',
        color: '',
        categoria_id: '',
        marca_id: ''
    });

    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // Estado de Carga
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Gestión de Imágenes (Híbrida: Existentes URL + Nuevas File)
    const [existingImages, setExistingImages] = useState<{ id: number, url: string }[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    
    // Gestión de Inventario (Existente + Nuevo)
    const [inventario, setInventario] = useState<any[]>([]);
    const [newTallas, setNewTallas] = useState<any[]>([]);
    const [deletedTallaIds, setDeletedTallaIds] = useState<number[]>([]);
    
    // Estado del Dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [tallaForm, setTallaForm] = useState({
        talla: '', cantidad: '', precio_compra: '', precio_venta: ''
    });

    // 3. Efecto: Cargar datos iniciales cuando la API responda
    useEffect(() => {
        if (tenis) {
            setFormData({
                nombre: tenis.nombre,
                color: tenis.color,
                categoria_id: tenis.categorias.id.toString(),
                marca_id: tenis.marcas.id.toString()
            });
            setExistingImages(tenis.imagenes_productos || []);
            setInventario(tenis.inventarios || []);
        }
    }, [tenis]);

    // --- MANEJADORES ---

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Imágenes: Agregar nuevas
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...filesArray]);
            const urls = filesArray.map(file => URL.createObjectURL(file));
            setNewPreviews(prev => [...prev, ...urls]);
        }
    };

    // --- ELIMINAR PRODUCTO COMPLETO ---
    const handleDeleteProduct = async () => {
        setIsDeleting(true);
        try {
            // 1) Borrar imágenes existentes
            if (existingImages.length > 0) {
                await Promise.all(existingImages.map(img => deleteImagenProducto(img.id)));
            }
            // 2) Borrar tallas existentes (inventario)
            if (inventario.length > 0) {
                await Promise.all(inventario.map(inv => deleteTalla(inv.id)));
            }
            // 3) Borrar el producto
            await deleteProduct(Number(id));

            alert("Producto eliminado correctamente");
            router.push('/products');
        } catch (err) {
            console.error("Error al eliminar producto:", err);
            alert("No se pudo eliminar el producto. Revisa la consola.");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    // Imágenes: Eliminar Existentes
    const removeExistingImage = (imgId: number) => {
        setExistingImages(prev => prev.filter(img => img.id !== imgId));
        setDeletedImageIds(prev => [...prev, imgId]);
    };

    // Imágenes: Eliminar Nuevas
    const removeNewImage = (index: number) => {
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    // Tallas: Agregar nueva (Localmente)
    const addTalla = () => {
        if (!tallaForm.talla || !tallaForm.cantidad) return;
        setNewTallas(prev => [...prev, tallaForm]);
        setTallaForm({ talla: '', cantidad: '', precio_compra: '', precio_venta: '' });
        setIsDialogOpen(false);
    };

    // Tallas: Eliminar existentes
    const removeExistingTalla = (tallaId: number) => {
        console.log("Eliminar talla ID:", tallaId);
        setInventario(prev => prev.filter(inv => inv.id !== tallaId));
        setDeletedTallaIds(prev => [...prev, tallaId]);
    };

    // Tallas: Eliminar nuevas
    const removeNewTalla = (index: number) => {
        setNewTallas(prev => prev.filter((_, i) => i !== index));
    };

    // --- LÓGICA PRINCIPAL DE GUARDADO ---
    const handleSaveChanges = async () => {
        // Validaciones
        if (!formData.nombre || !formData.marca_id || !formData.categoria_id) {
            alert("Por favor completa la información básica del producto");
            return;
        }

        setIsSubmitting(true);

        try {
            // --- PASO 1: Actualizar datos principales del producto ---
            await updateProduct(Number(id), {
                nombre: formData.nombre,
                color: formData.color,
                categoria_id: Number(formData.categoria_id),
                marca_id: Number(formData.marca_id)
            });

            // --- PASO 2: Eliminar imágenes marcadas como borradas ---
            await Promise.all(
                deletedImageIds.map(imgId => deleteImagenProducto(imgId))
            );

            // --- PASO 3: Subir nuevas imágenes ---
            await Promise.all(newImages.map(async (file, index) => {
                const cloudResponse = await uploadProductImage(file);
                const imageUrl = cloudResponse.secure_url;

                await createImagenProducto({
                    producto_id: Number(id),
                    url: imageUrl,
                    es_principal: false // Las nuevas no son principales
                });
            }));

            // --- PASO 4: Eliminar tallas marcadas como borradas ---
            await Promise.all(
                deletedTallaIds.map(tallaId => deleteTalla(tallaId))
            );

            // --- PASO 5: Crear nuevas tallas ---
            await Promise.all(newTallas.map(t => createTalla({
                producto_id: Number(id),
                talla: t.talla,
                cantidad: Number(t.cantidad),
                precio_compra: Number(t.precio_compra),
                precio_venta: Number(t.precio_venta)
            })));

            alert("Producto actualizado exitosamente");
            router.push(`/products/${id}`);

        } catch (error) {
            console.error("Error al guardar cambios:", error);
            alert("Hubo un error al guardar los cambios. Revisa la consola.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- CÁLCULOS VISUALES ---
    const allDisplayImages = [
        ...existingImages.map(img => ({ type: 'existing', src: img.url, id: img.id })),
        ...newPreviews.map((url, idx) => ({ type: 'new', src: url, id: idx }))
    ];

    const mainImage = allDisplayImages[0];
    const secondaryImages = allDisplayImages.slice(1, 5);
    const hasSecondaryImages = secondaryImages.length > 0;

    // --- RENDER ---

    if (isLoading) return <div className="h-screen flex items-center justify-center text-gray-500">Cargando producto...</div>;
    if (isError) return <div className="h-screen flex items-center justify-center text-red-500">Error al cargar datos.</div>;

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
                <Link href={`/products/${id}`}>
                    <Button variant="ghost" className='hover:bg-slate-100 flex items-center gap-2 pl-0 text-gray-600'>
                        <ArrowLeft size={20} /> Cancelar edición
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <Trash2 size={16}/> Eliminar producto
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Eliminar producto</DialogTitle>
                                <DialogDescription>
                                    Esto eliminará el producto, todas sus imágenes y tallas. Esta acción no se puede deshacer.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                                <Button disabled={isDeleting} variant="destructive" onClick={handleDeleteProduct}>
                                    {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando...</> : "Eliminar definitivamente"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* COLUMNA IZQUIERDA: Imágenes */}
                <div className="lg:col-span-7">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-xl">Galería</h2>
                        <label htmlFor="edit-image-upload" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Plus size={16}/> Agregar fotos
                        </label>
                        <input 
                            id="edit-image-upload" type="file" multiple accept="image/*" className="hidden" 
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className={`h-[500px] md:h-[600px] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 relative group transition-all`}>
                        {allDisplayImages.length === 0 ? (
                            <label htmlFor="edit-image-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <p className="text-gray-500">Sin imágenes</p>
                            </label>
                        ) : (
                            <div className={`grid grid-cols-1 ${hasSecondaryImages ? 'md:grid-cols-5' : ''} gap-2 h-full w-full p-2`}>
                                {/* Imagen Principal */}
                                <div className={`relative h-full ${hasSecondaryImages ? 'md:col-span-3' : 'md:col-span-5'} rounded-lg overflow-hidden group`}>
                                    <img src={mainImage.src} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => mainImage.type === 'existing' ? removeExistingImage(mainImage.id) : removeNewImage(mainImage.id)}
                                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                    >
                                        <X size={16}/>
                                    </button>
                                    {mainImage.type === 'new' && <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Nueva</span>}
                                </div>

                                {/* Secundarias */}
                                {hasSecondaryImages && (
                                    <div className="md:col-span-2 grid grid-cols-2 grid-rows-2 gap-2 h-full">
                                        {secondaryImages.map((img, idx) => (
                                            <div key={`${img.type}-${img.id}`} className="relative h-full w-full rounded-lg overflow-hidden group">
                                                <img src={img.src} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => img.type === 'existing' ? removeExistingImage(img.id) : removeNewImage(img.id as number)}
                                                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                                >
                                                    <X size={14}/>
                                                </button>
                                                {img.type === 'new' && <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 rounded-full">Nueva</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        * Los cambios se guardarán al presionar el botón "Guardar Cambios"
                    </p>
                </div>

                {/* COLUMNA DERECHA: Formulario */}
                <div className="lg:col-span-5 flex flex-col gap-8 py-2">
                    
                    {/* Datos Principales */}
                    <div className="space-y-6">
                        <div>
                            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">Categoría</Label>
                            <Select 
                                value={formData.categoria_id} 
                                onValueChange={(val) => handleInputChange('categoria_id', val)}
                            >
                                <SelectTrigger className="w-full border-0 border-b border-gray-200 rounded-none px-0 focus:ring-0 text-gray-900 font-medium">
                                    <SelectValue placeholder="Selecciona categoría" />
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
                            <Input 
                                className="text-3xl md:text-4xl font-bold border-none px-0 shadow-none placeholder:text-gray-300 h-auto py-2 focus-visible:ring-0" 
                                placeholder="Nombre del producto"
                                value={formData.nombre}
                                onChange={(e) => handleInputChange('nombre', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <Label className="text-gray-600">Marca</Label>
                                <Select 
                                    value={formData.marca_id} 
                                    onValueChange={(val) => handleInputChange('marca_id', val)}
                                >
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
                                <Label className="text-gray-600">Color</Label>
                                <Input 
                                    className="bg-gray-50 border-gray-200" 
                                    value={formData.color}
                                    onChange={(e) => handleInputChange('color', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección Inventario */}
                    <div className="flex flex-col gap-4 pt-8 border-t border-gray-100 mt-auto">
                        <div className="flex justify-between items-end">
                            <h2 className="font-semibold text-xl text-gray-900">Inventario</h2>
                            
                            {/* DIALOGO AGREGAR TALLA */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-100">
                                        <Plus size={16}/> Agregar Talla
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Agregar Talla</DialogTitle>
                                        <DialogDescription>Nueva entrada de inventario.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Talla</Label>
                                                <Input value={tallaForm.talla} onChange={(e) => setTallaForm({...tallaForm, talla: e.target.value})} placeholder="Ej. 28" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Stock</Label>
                                                <Input type="number" value={tallaForm.cantidad} onChange={(e) => setTallaForm({...tallaForm, cantidad: e.target.value})} placeholder="0" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Precio Compra ($)</Label>
                                                <Input type="number" value={tallaForm.precio_compra} onChange={(e) => setTallaForm({...tallaForm, precio_compra: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Precio Venta ($)</Label>
                                                <Input type="number" value={tallaForm.precio_venta} onChange={(e) => setTallaForm({...tallaForm, precio_venta: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={addTalla}>Agregar a la lista</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* LISTA DE INVENTARIO (Existente + Nuevo) */}
                        <div className="space-y-4">
                            {/* Existentes */}
                            {inventario.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {inventario.map((inv: any) => (
                                        <div key={inv.id} className={`rounded-lg p-2 border flex flex-col items-center justify-center text-center relative group ${inv.cantidad < 3 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                                            <button 
                                                onClick={() => removeExistingTalla(inv.id)} 
                                                className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={14}/>
                                            </button>
                                            <span className="text-xs text-gray-500 uppercase">Talla</span>
                                            <span className="text-lg font-bold">{inv.talla}</span>
                                            <span className={`text-xs font-medium ${inv.cantidad < 3 ? 'text-red-600' : 'text-gray-400'}`}>
                                                Stock: {inv.cantidad}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Nuevos (Marcados diferente visualmente) */}
                            {newTallas.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-blue-600 font-medium mb-2">Nuevas tallas por guardar:</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {newTallas.map((t, idx) => (
                                            <div key={idx} className="rounded-lg p-2 border border-blue-200 bg-blue-50 flex flex-col items-center justify-center text-center relative group">
                                                <button 
                                                    onClick={() => removeNewTalla(idx)} 
                                                    className="absolute top-1 right-1 text-blue-300 hover:text-red-500"
                                                >
                                                    <X size={12}/>
                                                </button>
                                                <span className="text-xs text-blue-500 uppercase">Talla</span>
                                                <span className="text-lg font-bold text-blue-900">{t.talla}</span>
                                                <span className="text-xs text-blue-600">Stock: {t.cantidad}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {inventario.length === 0 && newTallas.length === 0 && (
                                <div className="border-2 border-dashed border-gray-100 rounded-lg p-6 flex flex-col items-center text-center text-gray-400">
                                    <span className="text-sm">Sin tallas. Agrega una talla para establecer precios e inventario.</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6">
                            <Button 
                                className="w-full h-12 text-lg font-medium bg-gray-900 hover:bg-black text-white"
                                onClick={handleSaveChanges}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}