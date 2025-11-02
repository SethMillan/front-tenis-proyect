import { ReactNode } from "react";
// Libreria para las notificaciones
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-full relative flex flex-col items-center dark:bg-[#0f0f0f]">
      <h1 className="text-primary text-4xl pt-12 z-10 dark:text-[#E0E0E0]">
        Tenis Sport LZC
      </h1>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-8 w-full px-4">
        {children}
      </div>

      {/* Contenedor de Toasts */}
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
          width: "451px",
          minWidth: "451px",
          maxWidth: "451px",

          
        }}

      />
    </div>
  );
};

export default AuthLayout;
