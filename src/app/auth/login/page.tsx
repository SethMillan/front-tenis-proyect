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
    <div className="flex-1 flex w-full h-full items-center justify-center flex-col">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Iniciar sesion</CardTitle>
          <CardDescription>Ingresa a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage