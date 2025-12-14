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