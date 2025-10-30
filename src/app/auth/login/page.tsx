import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react"
import SigninForm from "./components/login-form"

const SignUpPage = () => {
  return (
    <div className="flex-1 flex w-full h-full items-center justify-center ">
      <Card className="dark:bg-[#1A1A1A]  w-full max-w-lg px-12 py-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl dark:text-[#E0E0E0]" >Iniciar Sesión</CardTitle>
          <CardDescription className="p-5 text-black dark:text-[#FFFFFF] ">Ingresa tus datos para poder ingresar</CardDescription>
        </CardHeader>
        <CardContent >
          <SigninForm />
        </CardContent>
      </Card>
    </div>
    
  )
}

export default SignUpPage