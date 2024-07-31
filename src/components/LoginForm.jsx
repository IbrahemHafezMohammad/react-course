import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import React, { useState } from "react";
import axios from "axios";
import { constants } from "../context/API/constants";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function LoginForm({ tap }) {
    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        setLoading(true);
        const apiUrl =
            tap === "seeker-tab"
                ? `${constants.BASE_URL}/seeker/login`
                : `${constants.BASE_URL}/employer/login`;

        try {
            const response = await axios.post(apiUrl, data);

            // If successful, set credentials and show success toast
            dispatch(
                setCredentials({
                    userInfo: response.data,
                    userType: tap === "seeker-tab" ? "seeker" : "employer",
                })
            );
            toast.success("Login successful!");
            navigate("/");

        } catch (error) {
            setLoading(false);

            if (error.response) {
                const statusCode = error.response.status;
                const message = error.response.data.message;

                if (statusCode === 404 && message === "USER_DOES_NOT_EXIST") {
                    setErrMsg("User does not exist.");
                    toast.error("User does not exist.");
                } else if (statusCode === 403) {
                    switch (message) {
                        case "ACCOUNT_INACTIVE":
                            setErrMsg("Account is inactive.");
                            toast.error("Account is inactive.");
                            break;
                        case "LOGIN_ATTEMPTS_EXCEEDED":
                            setErrMsg("Login attempts exceeded. Please try again later.");
                            toast.error("Login attempts exceeded. Please try again later.");
                            break;
                        case "PASSWORD_INCORRECT":
                            setError("password", {
                                type: "manual",
                                message: "Password is incorrect.",
                            });
                            toast.error("Password is incorrect.");
                            break;
                        default:
                            setErrMsg("An unknown error occurred. Please try again.");
                            toast.error("An unknown error occurred. Please try again.");
                    }
                } else {
                    setErrMsg("An error occurred. Please try again.");
                    toast.error("An error occurred. Please try again.");
                }
            } else {
                setErrMsg("An error occurred. Please try again.");
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    return (
        <form className="w-full flex flex-col gap-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                name="user_name"
                label="Username"
                placeholder="Username"
                type="text"
                register={register("user_name", {
                    required: "Username is required!",
                })}
                error={errors.user_name ? errors.user_name.message : ""}
            />

            <div className="relative">
                <TextInput
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    register={register("password", {
                        required: "Password is required!",
                    })}
                    error={errors.password ? errors.password.message : ""}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 mt-7 px-3 py-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            {errMsg && (
                <span role="alert" className="text-sm text-red-500 mt-0.5">
                    {errMsg}
                </span>
            )}

            {loading ? (
                <div className="flex justify-center">
                    <ClipLoader color="#4A90E2" size={35} />
                </div>
            ) : (
                <CustomButton
                    type="submit"
                    containerStyles="mt-4 inline-flex justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white outline-none hover:bg-blue-800"
                    title="Login"
                />
            )}

        </form>
    );
}

export default LoginForm;
