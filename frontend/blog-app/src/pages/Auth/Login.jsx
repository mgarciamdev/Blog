import { useContext, useState } from "react"
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { validateEmail } from "../../utils/helper";
import publicAxios from "../../utils/publicAxios";
import { API_PATHS } from "../../utils/apiPaths";
import Logo from '../../assets/react.svg';
import AuthInput from "../../components/Inputs/AuthInput";
import PageTransition from "../../components/Transitions/PageTransition";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const toastId = toast.loading("Iniciando sesión ....");

    if (!validateEmail(email)) {
      setError("Por favor ingrese un correo electronico valido");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    if (!password) {
      setError("Por favor ingrese la contraseña");
      setLoading(false);
      toast.dismiss(toastId);
      return;
    }

    try {
      const response = await publicAxios.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { accessToken, refreshToken, user, isBanned, banInfo } = response.data;

      if (
        !accessToken ||
        !refreshToken ||
        !user
      ) {
        throw new Error(
          "Respuesta de autenticación inválida"
        );
      }

      setTimeout(() => {
        // usuario baneado
        if (isBanned) {
          toast.error(
            banInfo?.reason ||
            "Tu cuenta esta baneado.",
            {
              id: toastId,
            }
          );

          return;
        }

        // Guardamos sesión
        updateUser(response.data);

        toast.success("Bienvenido", {
          id: toastId,
        });

        // Redireccionar según rol
        if (
          user.role === "admin" ||
          user.role === "superadmin"
        ) {
          navigate("/dashboard", {
            replace: true,
          });
        } else {
          navigate("/dashboard", {
            replace: true,
          });
        }

      }, 1500);
    } catch (error) {
      setTimeout(() => {
        toast.error(
          "Credenciales invalidas",
          { id: toastId }
        );

        setError(
          error.response?.data?.message ||
          "Login failed"
        );

        setLoading(false);

      }, 1500);
    }
  };

  return (
    <PageTransition>
      <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-3">
        <div className="relative flex flex-col justify-center px-8 md:px-16 bg-zinc-200 text-black col-span-1">

          {/* Logo arriba a la izquierda */}
          <div className="absolute top-6 left-6">
            <img
              src={Logo}
              alt="Logo"
              className="h-6 md:h-6.5"
              onClick={() => { navigate("/", { replace: true }); }}
            />
          </div>

          <div className="max-w-md w-full">
            <h1 className="text-3xl font-bold mb-2 ml-10">Bienvenidos</h1>
            <p className="text-zinc-800 mb-8 ml-10">Inicia sesión en tu cuenta</p>

            <form onSubmit={handleLogin} className="space-y-4 ml-10">
              <label className="text-[13px] text-slate-800 ">Email</label>
              <input
                type="email"
                required
                placeholder="tucorreo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // onInvalid={(e) => {
                //   e.target.setCustomValidity(
                //     'La dirección ingresada no incluye el signo "@"'
                //   )
                // }}
                onInput={(e) => {
                  e.target.setCustomValidity('');
                }}
                className="input-box"
              />

              <AuthInput
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 caracteres"
                type="password"
              />

              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-3 transition-all duration-500">
                  {error}
                </div>
              )}

              <p className="text-[13px] text-slate-800 mt-3">
                <button
                  type="button"
                  className="font-medium text-zinc-900 underline-offset-1 hover:text-emerald-800 hover:underline cursor-pointer"
                  onClick={() => {
                    navigate("/forget-password");
                  }}
                >
                  ¿Has olvidado tu contraseña?
                </button>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  "LOGIN"
                )}
              </button>

              <p className="text-[13px] text-zinc-900 hover:text-emerald-900 mt-5 cursor-pointer">
                Todavia no tienes cuenta? {" "}
                <button
                  type="button"
                  className="font-medium text-zinc-900 underline hover:text-emerald-500 cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Registrarse
                </button>
              </p>
            </form>
          </div>
        </div>

        <div
          className="hidden md:flex flex-col justify-center items-center bg-linear-to-br from-zinc-900 via-emerald-900 to-black text-white p-16 col-span-2 relative overflow-hidden">

          {/* Glow effect */}
          <div className="absolute w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full top-10 right-10" />

          <div className="relative z-10 max-w-2xl">

            <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
              Blog Platform
            </span>

            <h1 className="text-5xl font-bold leading-tight mt-4">
              Write ideas that inspire developers around the world.
            </h1>

            <p className="text-zinc-300 mt-6 text-lg leading-relaxed">
              Comparte conocimiento, crea contenido técnico y conecta
              con una comunidad moderna impulsada por IA.
            </p>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-4 mt-10 text-center">

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-zinc-300">
                  AI Content Generation
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-zinc-300">
                  JWT Authentication
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-zinc-300">
                  Modern Dashboard
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
                <p className="text-sm text-center text-zinc-300">
                  Community Moderation
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  )
};

export default Login;