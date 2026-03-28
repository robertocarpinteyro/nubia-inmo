"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Image from "next/image";
import { useAuth, API_BASE_URL } from "@/context/AuthContext";

import OpenEye from "@/assets/images/icon/icon_68.svg";

interface FormData {
   email: string;
   password: string;
}

const LoginForm = () => {
   const router = useRouter(); 
   const { login } = useAuth();

   const schema = yup
      .object({
         email: yup.string().required().email().label("Email"),
         password: yup.string().required().label("Password"),
      })
      .required();

   const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) });

   const [loading, setLoading] = useState(false);

   const onSubmit = async (data: FormData) => {
      setLoading(true);
      try {
         const response = await fetch(`${API_BASE_URL}/auth/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
         });

         const result = await response.json();

         if (response.ok) {
            // Guardar token y usuario en contexto + localStorage
            login(result.token, result.user);

            toast.success("Login exitoso", { position: "top-center" });
            reset();

            // Cerrar modal de Bootstrap antes de redirigir
            const modalEl = document.getElementById("loginModal");
            if (modalEl) {
               const bootstrap = (window as any).bootstrap;
               if (bootstrap) {
                  const modalInstance = bootstrap.Modal.getInstance(modalEl);
                  if (modalInstance) modalInstance.hide();
               }
            }
            // Limpiar backdrop y clases residuales del modal
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
            document.body.classList.remove("modal-open");
            document.body.style.removeProperty("overflow");
            document.body.style.removeProperty("padding-right");

            // Redirigir al dashboard
            router.push("/dashboard/dashboard-index");
         } else {
            toast.error(result.error || "Email o contraseña inválidos");
         }
      } catch (error) {
         toast.error("Error de conexión. Intenta de nuevo.");
      } finally {
         setLoading(false);
      }
   };

   const [isPasswordVisible, setPasswordVisibility] = useState(false);
   const togglePasswordVisibility = () => setPasswordVisibility(!isPasswordVisible);

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="row">
            <div className="col-12">
               <div className="input-group-meta position-relative mb-25">
                  <label>Email*</label>
                  <input type="email" {...register("email")} placeholder="tucorreo@gmail.com" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="input-group-meta position-relative mb-20">
                  <label>Contraseña*</label>
                  <input type={isPasswordVisible ? "text" : "password"} {...register("password")} placeholder="Ingresa tu contraseña" className="pass_log_id" />
                  <span className="placeholder_icon">
                     <span className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}>
                        <Image onClick={togglePasswordVisibility} src={OpenEye} alt="" />
                     </span>
                  </span>
                  <p className="form_error">{errors.password?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="agreement-checkbox d-flex justify-content-between align-items-center">
                  <div>
                     <input type="checkbox" id="remember" />
                     <label htmlFor="remember">Mantener sesión</label>
                  </div>
                  <Link href="#">¿Olvidaste tu contraseña?</Link>
               </div>
            </div>
            <div className="col-12">
               <button type="submit" className="btn-two w-100 text-uppercase d-block mt-20" disabled={loading}>
                  {loading ? "Ingresando..." : "INGRESAR"}
               </button>
            </div>
         </div>
      </form>
   )
}

export default LoginForm;
