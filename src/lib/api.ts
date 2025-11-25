import { API_URL } from "@/features/shared/api-url";

async function apiRequest(endpoint :string){
    const response = await fetch(`${API_URL}${endpoint}`);
    if(!response.ok){
        throw new Error(`API request failed with status ${response.status}`);
    }
    return response.json();
}

/* 
    ? Para obtener los demas endpoints solamente agregaremos una nueva funcion
    ? exportable para cada uno de ellos, similar a la de fetchTenis
 */
export async function fetchTenis(){
    return apiRequest('/productos');
}

export async function fetchByTenisId(id: string){
    return apiRequest('/productos/'+id);
}

export async function fetchMarcas(){
    return apiRequest('/marcas');
}

export async function fetchCategorias(){
    return apiRequest('/categorias');
}

export async function fetchEmpleados(){
    return apiRequest('/empleados');
}

export async function fetchClientes(){
    return apiRequest('/clientes');
}  
  
export async function fetchSales(){
    return apiRequest('/ventas');
}