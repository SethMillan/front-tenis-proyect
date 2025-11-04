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