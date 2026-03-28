"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation"; 
import { useAuth, API_BASE_URL } from "@/context/AuthContext";

import OpenEye from "@/assets/images/icon/icon_68.svg";

interface FormData {
  name: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}

const RegisterForm = () => {
  const router = useRouter(); 
  const { login } = useAuth();

  const schema = yup
  .object({
    name: yup.string().required("El nombre es obligatorio"),
    email: yup.string().required("El email es obligatorio").email("Email inválido"),
    password: yup.string().required("La contraseña es obligatoria"),
    termsAccepted: yup
      .boolean()
      .oneOf([true], "Debes aceptar los términos y condiciones") 
      .required(),
  })
  .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, data);

      if (response.status === 201) {
        // Guardar token y usuario en contexto + localStorage
        login(response.data.token, response.data.user);

        toast.success("¡Registro exitoso! Redirigiendo...", {
          position: "top-center",
        });

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
        document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
        document.body.classList.remove("modal-open");
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");

        setTimeout(() => router.push("/dashboard/dashboard-index"), 500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error durante el registro", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Nombre*</label>
            <input type="text" {...register("name")} placeholder="Tu nombre" />
            <p className="form_error">{errors.name?.message}</p>
          </div>
        </div>
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
            <input
              type={isPasswordVisible ? "text" : "password"}
              {...register("password")}
              placeholder="Ingresa tu contraseña"
              className="pass_log_id"
            />
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
              <input type="checkbox" id="termsAccepted" {...register("termsAccepted")} />
              <label htmlFor="termsAccepted">
                Al registrarte aceptas los{" "}
                <Link href="#">Términos y condiciones</Link> y <Link href="#">Política de privacidad</Link>
              </label>
              <p className="form_error">{errors.termsAccepted?.message}</p>
            </div>
          </div>
        </div>
        <div className="col-12">
          <button type="submit" className="btn-two w-100 text-uppercase d-block mt-20" disabled={loading}>
            {loading ? "Registrando..." : "REGISTRARSE"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
