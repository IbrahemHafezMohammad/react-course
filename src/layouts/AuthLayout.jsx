import { Office } from "../assets/images";

function AuthLayout() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <img src={Office} alt="Office" className="object-contain mb-4" />

    </div>
  );
}

export default AuthLayout;
