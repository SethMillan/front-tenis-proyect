import { ReactNode } from "react"
// Libreria para las notificaciones
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center dark:bg-[#0f0f0f] px-4 gap-6 sm:gap-8">
      <h1 className="text-primary text-3xl sm:text-4xl pt-8 sm:pt-12 mb-0 sm:mb-2 dark:text-[#E0E0E0]">
        Tenis Sport LZC
      </h1>

      <div className="w-full max-w-lg">
        {children}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={1}
        style={{
          width: "clamp(280px, 90vw, 451px)",
        }}
      />
    </div>
  )
}

export default AuthLayout