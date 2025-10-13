import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center align-middle">
      <div className="w-[758px] h-[697px] rounded-[50px] border border-[#E0E0E0] bg-white shadow-[0_2px_10px_0.1px_rgba(0,0,0,0.10)] ">
        {children}
      </div>
    </div>
  );
}
