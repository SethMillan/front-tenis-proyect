"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const loginSchema = z.object({
  email: z.email({ message: "El email no es valido" }),
  password: z.string().min(6, { message: "Debe tener al menos 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

const RegisterForm = () => {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = form.handleSubmit (data => {
        console.log (data)
    })

    return <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
        <Form {...form}>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Correo electronico</FormLabel>
                    <FormControl>
                        <Input placeholder="Escribe el correo electronico" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </Form>
        <Form {...form}>
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                        <Input placeholder="Escribe tu contraseña" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </Form>
        <Button type="submit">Iniciar sesion</Button>
        <Button variant={"link"} asChild> 
            <Link href="/auth/register">
            Registrarse
            </Link>
        </Button>
    </form>
}

export default RegisterForm