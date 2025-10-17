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
    <div className="flex-1 flex w-full h-full items-center justify-center flex-col">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Registrarse</CardTitle>
          <CardDescription>Crear una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage