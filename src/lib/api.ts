import { API_URL } from "@/features/shared/api-url";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",

      ...(token && { Authorization: `Bearer ${token}` }),

      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}
 

/* 
    ? Para obtener los demas endpoints solamente agregaremos una nueva funcion
    ? exportable para cada uno de ellos, similar a la de fetchTenis
 */

export async function fetchTenis() {
  return apiRequest("/productos");
}

export async function fetchByTenisId(id: string) {
  return apiRequest("/productos/" + id);
}

export async function fetchMarcas() {
  return apiRequest("/marcas");
}

export async function fetchCategorias() {
  return apiRequest("/categorias");
}

export async function fetchEmpleados() {
  return apiRequest("/empleados");
}

export async function updateEmpleado(id: number, data: any) {
  return apiRequest(`/empleados/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}


export async function fetchClientes() {
  return apiRequest("/clientes");
}

export async function createCliente(data: any) {
  return apiRequest("/clientes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCliente(id: number, data: any) {
  return apiRequest(`/clientes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}


export async function fetchSales() {
  return apiRequest("/ventas");
}

export async function createVenta(data: any) {
  return apiRequest("/ventas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createProduct(data: any) {
  return apiRequest("/productos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: any) {
  return apiRequest(`/productos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number) {
  return apiRequest(`/productos/${id}`, {
    method: "DELETE",
  });
}

export async function uploadProductImage(imageFile: File) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const formData = new FormData();
  formData.append("file", imageFile); // la imagen
  formData.append("upload_preset", "tenis-tis"); // tu preset configurado en Cloudinary
  formData.append("folder", "tenis/productos"); // carpeta destino en Cloudinary

  const response = await fetch("https://api.cloudinary.com/v1_1/dkbaexswa/image/upload", {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload image with status ${response.status}`);
  }

  return response.json(); // devuelve el JSON con la URL pública, secure_url, etc.
}

export async function createImagenProducto(data: any) {
  return apiRequest("/imagenes-productos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteImagenProducto(id: number) {
  return apiRequest(`/imagenes-productos/${id}`, {
    method: "DELETE",
  });
}

export async function createTalla(data: any) {
  return apiRequest("/inventario", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTalla(id: number, data: any) {
  return apiRequest(`/inventario/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTalla(id: number) {
  return apiRequest(`/inventario/${id}`, {
    method: "DELETE",
  });
}

export async function fetchSalesReportPDF(fechaInicio: string, fechaFin: string) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const url = new URL(`${API_URL}/ventas/reporte/pdf`);
  url.searchParams.append("fechaInicio", fechaInicio);
  url.searchParams.append("fechaFin", fechaFin);

  const response = await fetch(url.toString(), {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sales report with status ${response.status}`);
  }

  return response.blob();
}

export async function fetchInventario(){
    return apiRequest('/inventario');
}