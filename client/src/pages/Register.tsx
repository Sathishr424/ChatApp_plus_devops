import BackgroundImg from "@/assets/background.jpg";
import { theme } from "@/config/theme";
import type { RegisterRequestDTO } from "@/dto/DTOs";
import AuthService from "@/services/AuthService";
import { handleAPIRequest } from "@/utils/helper";
import { SatToast, ToastType } from "@/utils/SatAlert";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Regiser() {
  const [data, setData] = useState<RegisterRequestDTO>({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onDataChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [ev.target.name]: ev.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await handleAPIRequest(async () => {
      return await AuthService.register(data);
    }, setIsLoading)
    SatToast.alert("Regiser successfull!", ToastType.SUCCESS);
    navigate("/login");
  }

  return <>
    <section className="w-screen flex flex-row justify-center items-center h-full">
      <section className="w-full h-full p-10 m-20 bg-slate-800 text-white flex flex-col md:flex-row justify-center items-center">
        <section className="mx-2 p-10">
          <img src={BackgroundImg} alt="" className="w-auto rounded-2xl max-w-[300px]" />
        </section>
        <section className="mx-2">
          <h1 className="text-2xl font-bold">Welcome back...</h1>
          <form onSubmit={handleSubmit} className="my-4">
            {
              Object.entries(data).map(([key, value]) => {
                return <div key={key} className="my-4">
                  <label htmlFor={key} className="hidden">{value}</label>
                  <input className="px-4 py-2 rounded-md bg-gray-700 outline-none" placeholder={key.charAt(0).toUpperCase() + key.slice(1)} onChange={onDataChange} type={key} name={key} value={value} />
                </div>
              })
            }
            <button disabled={isLoading} className="cursor-pointer my-2 w-full bg-pink-500 flex justify-center items-center py-2 rounded-full font-bold">
              {
                isLoading ?
                  <div className={`w-6 h-6 border-4 rounded-full animate-spin my-2 ${theme.predefined.loading}`} />
                  : "Register"
              }
            </button>
            <div className="my-6 relative flex items-center justify-center">
              <div className="w-full p-[0.5px] bg-white"></div>
              <div className="absolute -top-3 bg-slate-800 px-2">OR</div>
            </div>
            <Link to="/login" className="cursor-pointer my-2 w-full border-2 border-white flex justify-center items-center py-2 rounded-full font-bold">
              Sign In
            </Link>
          </form>
        </section>
      </section>
    </section>
  </>
}
