import React from "react";
import { useSelector } from "react-redux";
import { DotLoader } from "react-spinners";

export default function Spinner() {
    let isLoading = useSelector((state) => state.spinnerSlice.isLoading)
    console.log("🚀 ~ Spinner ~ isLoading:", isLoading)
    
  return isLoading ? (
    <div className="fixed w-screen h-screen top-0 left-0 bg-gray-800 z-20 flex justify-center items-center">
      <DotLoader color="#D65E60" size={100} speedMultiplier={1} />
    </div>
  ) : (
    <></>
  );
}
