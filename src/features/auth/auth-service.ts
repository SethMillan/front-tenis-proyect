import { API_URL } from "../shared/api-url";
import { JwtPayload } from "./jwt-payload"

type RegisterDTO = {
    email: string;
    password: string;
    nombre: string;
    apellido_p: string;
    apellido_m: string;
    rol: 'Admin' | 'Employee'; // Restringir a los valores permitidos
}

export const authService = {
    register: async (data: RegisterDTO) => {

        const response = await fetch(`${API_URL}/auth/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            return { ok: false }
        }
        return { ok: true }
    },
    login: async (data: {
        email: string; 
        password: string;
    }) => {
        const response = await fetch(`${API_URL}/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
        return { ok: false }
        }
        const json:{message: string, access_token: string} = await response.json();
        return { ok: true, token: json.access_token };
    },
}