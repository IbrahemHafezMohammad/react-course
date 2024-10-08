import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { constants } from "../context/API/constants";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { changeVerifyEmailStatus } from "../slices/authSlice";

const VerifyEmailPage = () => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [emailToken, setEmailToken] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { userInfo, emailVerified, token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setIsActive(true);
    }
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await axios.post(
        `${constants.BASE_URL}/email/verification-notification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSeconds(60);
      setIsActive(false);
      setResendLoading(false);
      toast.success("Please Check Your Email!");
    } catch (error) {
      setResendLoading(false);
      toast.error("Email Resend Failed!");
      console.error("Failed to resend verification email", error);
    }
  };

  const handleVerify = async () => {
    setLoading(true);

    if (!emailToken) {
      setErrMsg("Token is required.");
      return;
    }

    try {
      const response = await axios.post(
        `${constants.BASE_URL}/email/verify`,
        { token: emailToken },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(changeVerifyEmailStatus({ emailVerified: "yes" }));
      toast.success("Verify Successful!");
      navigate("/");
    } catch (error) {
      setLoading(false);

      console.error("Failed to verify email", error);
      setErrMsg("Failed to verify email");

      if (error.response) {
        const statusCode = error.response.status;
        const message = error.response.data.message;

        if (statusCode === 400) {
          switch (message) {
            case "EMAIL_ALREADY_VERIFIED":
              dispatch(changeVerifyEmailStatus({ emailVerified: "yes" }));
              toast.error("Email Already Verified.");
              break;
            case "INVALID_VERIFICATION_TOKEN":
              toast.error("Invalid Verification Token.");
              break;
            case "VERIFICATION_TOKEN_EXPIRED":
              toast.error("Verification Token Expired.");
              break;
          }
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <p className="mb-4">
          Please enter the token sent to your email to verify your account.
        </p>

        <input
          type="text"
          value={emailToken}
          onChange={(e) => setEmailToken(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
          placeholder="Enter your token"
        />

        {errMsg && <p className="text-red-500 mb-4">{errMsg}</p>}

        {loading ? (
          <div className="flex justify-center">
            <ClipLoader color="#4A90E2" size={35} />
          </div>
        ) : (
          <button
            onClick={handleVerify}
            className="w-full mb-4 px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded"
          >
            Verify Email
          </button>
        )}

        {resendLoading ? (
          <div className="flex justify-center">
            <ClipLoader color="#4A90E2" size={35} />
          </div>
        ) : (
          <button
            onClick={handleResend}
            disabled={!isActive}
            className={`mt-4 px-4 py-2 text-white w-full ${
              isActive ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
            } rounded`}
          >
            {isActive ? "Resend Email" : `Resend Email (${seconds})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
