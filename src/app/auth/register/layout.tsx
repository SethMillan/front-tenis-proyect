import { ReactNode } from "react"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-full flex flex-col gap-8 items-center ">
      <h1 className="text-primary text-4xl">Layout</h1>
      {children}
    </div>
  )
}

export default AuthLayout