import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react"
import SignupForm from "./components/register-form"

const SignUpPage = () => {
  return (
    <div className="flex-1 flex w-full h-full items-center justify-center ">
      <Card className="dark:bg-[#1A1A1A]  w-full max-w-lg px-12 py-10 dark:border-none shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl dark:text-[#E0E0E0]">Registrarse</CardTitle>
          <CardDescription className="p-5 text-black dark:text-[#FFFFFF]">Crear una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage