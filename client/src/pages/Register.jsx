import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { registerNewUser } from "../redux/state/authSlice";
import { useTranslation } from "react-i18next";


const Register = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {t} = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (val) => {
    try {
      delete val.confirmPassword;
      await dispatch(registerNewUser(val)).unwrap(); // unwrap to handle async errors in catch block
      toast.success(t("Registration successful!"));
      navigate("/");
    } catch (error) {
      console.log(t("Error creating user: "), error);
      toast.error(t("Invalid credentials. Please try again."));
    }
  };

  const password = watch("password");

  return (
    <div className="p-2 h-screen flex justify-center items-center bg-green-300 bg-[url('/bg.jpg')] bg-cover">
      <Card className="backdrop-blur-xl bg-transparent text-white p-3 md:p-10 w-[100%] md:w-[80%] lg:w-[60%]">
        <CardHeader className="text-2xl">{t("Register Here.")}</CardHeader>
        <CardBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <Input
              isRequired
              label={t("Name")}
              variant="underlined"
              defaultValue=""
              {...register("name", {
                required: t("Name is required"),
                minLength: {
                  value: 2,
                  message: t("Name must be at least 2 characters"),
                },
              })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <div className="flex gap-4 w-full">
              <Input
                isRequired
                label={t("Email")}
                type="email"
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
                label={t("Contact Info")}
                type="tel"
                variant="underlined"
                {...register("contact_info", {
                  required: t("Contact info is required"),
                  pattern: {
                    value: /^\d+$/,
                    message: t("Contact info must be numeric"),
                  },
                })}
                isInvalid={!!errors.contact_info}
                errorMessage={errors.contact_info?.message}
              />
            </div>

            <Input
              isRequired
              label={t("Address")}
              variant="underlined"
              {...register("address", { required: t("Address is required") })}
              isInvalid={!!errors.address}
              errorMessage={errors.address?.message}
            />

            <div className="flex gap-4 w-full">
              <Input
                isRequired
                label={t("State")}
                variant="underlined"
                {...register("state", { required: t("State is required") })}
                isInvalid={!!errors.state}
                errorMessage={errors.state?.message}
              />
              <Input
                isRequired
                label={t("City")}
                variant="underlined"
                {...register("city", { required: t("City is required") })}
                isInvalid={!!errors.city}
                errorMessage={errors.city?.message}
              />
            </div>

            <Input
              isRequired
              label={t("Password")}
              variant="underlined"
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

            <Input
              isRequired
              type={confirmPasswordVisible ? "text" : "password"}
              label={t("Confirm Password")}
              variant="underlined"
              {...register("confirmPassword", {
                required: t("Confirm Password is required"),
                validate: (value) =>
                  value === password || t("Passwords do not match"),
                onChange: () => trigger("confirmPassword"),
              })}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            <Button
              className="w-full md:w-[70%] mt-10 mb-2"
              type="submit"
              color="secondary"
            >
              {loading ? <Spinner /> : t("Register")}
            </Button>
            <Link to={"/login"} className="hover:underline text-sm">
              {t("Already have an account? Login now.")}
            </Link>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
export default Register;
