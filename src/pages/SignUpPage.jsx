import { useState } from "react";
import { Office } from "../assets";
import { useLocation } from "react-router-dom";
import SeekerRegisterForm from "../components/SeekerRegisterForm";
import EmployerRegisterForm from "./EmployerRegisterForm";
import LoginForm from "../components/LoginForm";

function SignUpPage() {

  const location = useLocation();
  const { isLogin } = location.state || {}

  const [tab, setTab] = useState("seeker-tab");

  const renderForm = () => {
    if (isLogin) {
      return <LoginForm tap={tab} />
    }
    if (tab === "seeker-tab") {

      return <SeekerRegisterForm />;
    } else {
      return <EmployerRegisterForm />;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${Office})` }}
      />
      <div className="fixed inset-0 flex items-center justify-center mt-20 bg-black bg-opacity-50 z-10">
        <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto max-h-screen">
          <div className="mb-4 flex">
            <button
              className={`flex-1 px-4 py-2 font-bold ${tab === "seeker-tab"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
                } rounded-tl rounded-bl`}
              onClick={() => setTab("seeker-tab")}
            >
              Seeker
            </button>
            <button
              className={`flex-1 px-4 py-2 font-bold ${tab === "employer-tab"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
                } rounded-tr rounded-br`}
              onClick={() => setTab("employer-tab")}
            >
              Employer
            </button>
          </div>
          <div className="overflow-y-auto max-h-[65vh]">
            {" "}
            {/* Ensuring the content is scrollable */}
            {renderForm()}
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
