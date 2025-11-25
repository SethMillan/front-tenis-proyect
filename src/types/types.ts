// Interfaces base
export interface Marca {
  id: number;
  nombre: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Inventario {
  id: number;
  producto_id: number;
  talla: string;
  cantidad: number;
  precio_venta: string;
  precio_compra: string;
}
// Nueva interfaz para imágenes de productos
export interface ImagenProducto {
  id: number;
  producto_id: number;
  url: string;
  es_principal: boolean;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: number;
  nombre: string;
  color: string;
  categoria_id: number;
  marca_id: number;
  activo: boolean;
  categorias: Categoria;
  marcas: Marca;
  inventarios: Inventario[];
  imagenes_productos: ImagenProducto[]; 
}

export interface Cliente {
  id: number;
  nombres: string;
  apellido_p: string;
  apellido_m: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string;
  domicilio_id: number | null;
  activo: boolean;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido_p: string;
  apellido_m: string;
  telefono: string;
  rol: string;
  activo: boolean;
  email: string | null;
}

export interface DetalleVenta {
  id: number;
  venta_id: number;
  inventario_id: number;
  cantidad: number;
  total: string;
  inventarios: {
    id: number;
    producto_id: number;
    talla: string;
    cantidad: number;
    precio_venta: string;
    precio_compra: string;
    productos: {
      id: number;
      nombre: string;
      color: string;
      categoria_id: number;
      marca_id: number;
      activo: boolean;
    };
  };
}

export interface Venta {
  id: number;
  fecha: string;
  tipo_venta: 'Presencial' | 'Online';
  tipo_pago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  cliente_id: number | null;
  empleado_id: number;
  subtotal: string;
  descuento: string;
  total: string;
  created_at: string;
  updated_at: string;
  clientes: Cliente | null;
  empleados: Empleado;
  detalleventas: DetalleVenta[];
}