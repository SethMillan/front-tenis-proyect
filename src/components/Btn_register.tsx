import Link from "next/link";
import React from "react";

export default function Button() {
  return (
    <div className="bg-[var(--background-btn)] hover:bg-[#0056b3] transition duration-300 w-[151px] h-[67px] rounded-[10px] flex justify-center items-center">
      <Link href="/" className="text-[#fff] text-[20px]">Registrar</Link>
    </div>
  );
}
