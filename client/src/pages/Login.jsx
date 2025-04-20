import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/state/authSlice";
import { useTranslation } from "react-i18next";


const Login = () => {
  const { isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {t} = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (val) => {
    try {
      console.log(val);
      await dispatch(login(val)).unwrap(); // unwrap to handle async errors in catch block
      toast.success(t("Login successful!"));
      navigate("/");
    } catch (error) {
      console.log(t("Error creating user: "), error);
      toast.error(t("Invalid credentials. Please try again."));
    }
  };

  return (
    <div className="login-bg bg-cover h-screen flex justify-center items-center p-2">
      <Card className="backdrop-blur-xl bg-transparent text-white  p-3 md:p-10 w-[100%] md:w-[80%] lg:w-[60%]">
        <CardHeader className="text-2xl">{t("Login Here.")}</CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <Input
              isRequired
              type="email"
              label={t("Email")}
              variant="underlined"
              defaultValue=""
              {...register("email", {
                required: t("Email is required"),
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: t("Invalid email address"),
                },
                onChange: () => trigger("email"),
              })}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <Input
              isRequired
              label={t("Password")}
              variant="underlined"
              defaultValue=""
              {...register("password", {
                required: t("Password is required"),
                minLength: {
                  value: 6,
                  message: t("Password must be at least 6 characters"),
                },
                onChange: () => trigger("password"),
              })}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={passwordVisible ? "text" : "password"}
            />
            <Button
              className="w-full md:w-[70%] mt-10 mb-2 "
              type="submit"
              color="secondary"
            >
              {loading ? <Spinner /> : t("Login")}
            </Button>
            <p className="text-sm">or</p>
            <Link to={"/register"} className="hover:underline text-sm">
              {t("New here? Register now.")}
            </Link>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
export default Login;
