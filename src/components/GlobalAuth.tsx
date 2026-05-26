import { useDispatch } from "react-redux";
import type { AppDispatch } from "../config/redux/store";
import { useState } from "react";
import { login, register } from "../config/redux/reducers/auth";
import toast from "react-hot-toast";
import { LoginCard } from "../components/cards/LoginCard";
import { RegisterCard } from "../components/cards/RegisterCard";
import GlobalLoader from "../components/GlobalLoader";

export default function GlobalAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(true);

  const handleLogin = (form: any) => {
    setIsLoading(true);
    dispatch(login({ payload: form })).then((res: any) => {
      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Logged In");
      }
      setIsLoading(false);
    });
  };

  const handleRegister = (form: any) => {
    setIsLoading(true);
    dispatch(register({ payload: form })).then((res: any) => {
      if (res.error) {
        toast.error(res.error.message);
      } else {
        toast.success("Account Registered");
      }
      setIsLoading(false);
      handleNavigate();
    });
  };

  const handleNavigate = () => {
    setShowLoginCard(!showLoginCard);
  };

  return (
    <div className="fixed inset-0 bg-primary/90 flex items-center justify-center p-4">
      <div className="flex justify-center items-center p-4 w-full md:w-[50%] lg:w-[20%] relative bg-primary rounded-lg glowBox">
        {showLoginCard ? (
          <LoginCard
            handleLogin={handleLogin}
            isLoading={isLoading}
            handleNavigate={handleNavigate}
          />
        ) : (
          <RegisterCard
            handleRegister={handleRegister}
            isLoading={isLoading}
            handleNavigate={handleNavigate}
          />
        )}
        <GlobalLoader showBg={false} isLoading={isLoading} />
      </div>
    </div>
  );
}
