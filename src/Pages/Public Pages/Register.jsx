import React from "react";
import { useForm } from "react-hook-form";
import Input from "../../Components/UI/Input.jsx";
import {
    emailValidation,
    passwordValidation,
    usernameValidation,
} from "../../Utils/Validations.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Toolkit/Slices/AuthSlice.js";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading: authLoading, error: authError } = useSelector(s => s.auth);
    const { loading: prodLoading, error: prodError } = useSelector(s => s.products);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async data => {
        const result = await dispatch(registerUser(data));
        if (typeof result.endsWith("/fulfilled")) {
            navigate("/login");
        }
    };

    const loading = authLoading || prodLoading;
    const error = authError || prodError;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm"
            >
                <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>

                <Input
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    register={register}
                    validation={usernameValidation}
                    error={errors.username?.message}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    register={register}
                    validation={emailValidation}
                    error={errors.email?.message}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    register={register}
                    validation={passwordValidation}
                    error={errors.password?.message}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white rounded-xl py-2 mt-2 hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Registering…
                        </>
                    ) : (
                        "Register"
                    )}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-black hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;