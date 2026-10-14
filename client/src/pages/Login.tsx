import type { LoginRequestDTO } from "@/dto/DTOs";
import AuthService from "@/services/AuthService";
import { SatToast, ToastType } from "@/utils/SatAlert";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackgroundImg from "@/assets/background.jpg"
import { handleAPIRequest } from "@/utils/helper";
import { theme } from "@/config/theme";

export default function Login() {
  const [data, setData] = useState<LoginRequestDTO>({ email: "", password: "" });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onDataChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [ev.target.name]: ev.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleAPIRequest(async () => {
      return await AuthService.login(data);
    }, setIsLoading)
    SatToast.alert("Login successfull!", ToastType.SUCCESS);
    navigate("/");
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
                  : "Login"
              }
            </button>
            <div className="my-6 relative flex items-center justify-center">
              <div className="w-full p-[0.5px] bg-white"></div>
              <div className="absolute -top-3 bg-slate-800 px-2">OR</div>
            </div>
            <Link to="/register" className="cursor-pointer my-2 w-full border-2 border-white flex justify-center items-center py-2 rounded-full font-bold">
              Sign Up
            </Link>
          </form>
        </section>
      </section>
    </section>
  </>
}
