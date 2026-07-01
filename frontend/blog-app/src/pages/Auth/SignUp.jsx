import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicAxios from "../../utils/publicAxios";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { validateEmail } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";
import Logo from '../../assets/react.svg';

import { LuArrowLeft } from 'react-icons/lu';
import AuthInput from "../../components/Inputs/AuthInput";
import PassowordField from "../../components/Inputs/PassowordField";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import UsernameField from "../../components/Inputs/UsernameField";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../../components/Transitions/PageTransition";

const SignUp = () => {
  const [step, setStep] = useState(1);

  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [usernameError, setUsernameError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [debounceUsername, setDebounceUsername] = useState("");
  const navigate = useNavigate();

  const checkUsername = async (value) => {
    try {
      const response = await publicAxios.get(API_PATHS.USUARIOS.PUBLICOS.VERIFICAR_USERNAME,
        {
          params: { username: value },
        }
      );

      if (response.data.available) {
        setUsernameError(null);
        setSuggestions([]);
      } else {
        setUsernameError(response.data.message);
        setSuggestions(response.data.suggestions || []);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceUsername(username);
    }, 1500);

    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    if (debounceUsername.trim().length <= 2) return;

    checkUsername(debounceUsername);
  }, [debounceUsername]);

  const isStep1Valid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "";

  const handleSignup = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    let profileImageUrl = "";

    const toastId = toast.loading("Registrando usuario....");

    try {

      if (!fullName) {
        throw new Error("Porfavor ingrese su nombre completo");
      }

      if (!validateEmail(email)) {
        throw new Error("Por favor ingrese un correo electronico valido");
      }

      if (password.length > 12) {
        throw new Error("La contraseña debe tener mínimo 12 caracteres");
      }

      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await publicAxios.post(API_PATHS.AUTH.REGISTRAR, {
        name: fullName,
        username,
        email,
        password,
        profileImageUrl,
      });

      toast.success(
        response.data.message || "Registro exitoso",
        { id: toastId }
      );

      setSignupSuccess(true);

    } catch (error) {
      toast.dismiss(toastId);

      setError(
        error.response?.data?.message ||
        error.message ||
        "Algo salío mal. Inténtalo nuevamente."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="hidden md:flex flex-col md:col-span-1 lg:col-span-2 justify-center items-center bg-linear-to-br from-zinc-900 via-emerald-900 to-black text-white p-16 col-span-2 relative overflow-hidden">
          <div className="max-w-2xl text-center">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Únete a la comunidad
            </h1>

            <p className="text-zinc-300 text-lg leading-relaxed">
              Comparte ideas, descubre nuevas tecnologías y conecta con
              desarrolladores de todo el mundo.
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-center px-8 md:px-16 bg-zinc-200 text-black col-span-1">

          {/* Logo arriba a la derecha */}
          <div className="absolute top-6 right-6">
            <img
              src={Logo}
              alt="Logo"
              className="h-6 md:h-6.5"
              onClick={() => { navigate("/", { replace: true }); }}
            />
          </div>

          <div className="max-w-md w-full flex flex-col justify-center">
            {step === 2 && (
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 mb-4"
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
              >
                <LuArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            <h1 className="text-2xl font-bold mb-2">Crear una cuenta</h1>
            <p className="text-zinc-800 mb-8">
              {step === 1
                ? "Unete hoy ingresando tus datos debajo"
                : "Escoje tu nombre de usuario y sube tu foto de perfil"
              }
            </p>

            <div
              className={`transition-opacity duration-700 ${signupSuccess ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
              <form onSubmit={handleSignup} className="space-y-5">
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-1 gap-5">
                      <AuthInput
                        value={fullName}
                        onChange={({ target }) => setFullName(target.value)}
                        label="Nombre completo"
                        placeholder="Nombre completo"
                        type="text"
                      />

                      <AuthInput
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email"
                        placeholder="Correo Electronico"
                        type="text"
                      />

                      <PassowordField password={password} setPassword={setPassword} />

                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mr-10">
                      <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                    </div>

                    <UsernameField
                      username={username}
                      setUsername={setUsername}
                      usernameError={usernameError}
                      setUsernameError={setUsernameError}
                      suggestions={suggestions}
                      setSuggestions={setSuggestions}
                    />
                  </>
                )}

                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-3 transition-all duration-500">
                    {error}
                  </div>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    className={`btn-primary ${!isStep1Valid ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => {
                      if (!isStep1Valid) return;
                      setError(null);
                      setStep(2);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    disabled={loading || !isStep1Valid}
                  >
                    Siguiente
                  </button>
                ) : (
                  <button type="button" className="btn-primary" onClick={handleSignup} disabled={loading}>
                    {loading ? "Creando cuenta..." : "Registrarse"}
                  </button>
                )}

                <p className="text-[13px] text-zinc-900 hover:text-emerald-900 mt-5 cursor-pointer">
                  Ya tienes cuenta ?{" "}
                  <button
                    type="button"
                    className="font-medium text-zinc-900 underline hover:text-emerald-500 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Iniciar sesión
                  </button>
                </p>

              </form>
            </div>

            <AnimatePresence>
              {signupSuccess && (
                <motion.div
                  key="signup-success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="ml-10"
                >
                  <div className="bg-white border border-zinc-400 rounded p-4 shadow-sm">
                    <h2 className="text-md font-semibold mb-2 flex items-center gap-2">
                      <span className="text-green-500">✔</span>
                      Comprueba tu correo electrónico para confirmar.
                    </h2>
                    <p className="text-[13px] text-zinc-600">
                      Te has registrado correctamente. Por favor, revisa tu correo electrónico para
                      confirmar tu cuenta antes de iniciar sesión. El enlace de confirmación
                      caduca en 15 minutos.
                    </p>
                  </div>

                  <p className="text-[13px] text-zinc-900 hover:text-emerald-900 mt-5 cursor-pointer">
                    Ya tienes cuenta ?{" "}
                    <button
                      type="button"
                      className="font-medium text-zinc-900 underline hover:text-emerald-500 cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      Iniciar sesión
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </PageTransition>
  )
};

export default SignUp;