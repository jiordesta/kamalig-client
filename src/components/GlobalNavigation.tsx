import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ModalAction, ModalType, useModal } from "./hooks/UseModal";
import type { AppDispatch, RootState } from "../config/redux/store";
import { Device } from "../config/redux/reducers/config";
import { logout, reset } from "../config/redux/reducers/auth";
import { TABS } from "../libs/enums";

type NavButtonType = {
  label: string;
  path: string;
  icon: string;
};

const NAV_BUTTONS: NavButtonType[] = [
  { label: TABS.STOCKS, path: TABS.STOCKS, icon: "/icons/stock.svg" },
  { label: TABS.ONBOARDING, path: TABS.ONBOARDING, icon: "/icons/onboard.svg" },
  { label: TABS.PRODUCTS, path: TABS.PRODUCTS, icon: "/icons/product.svg" },
  { label: TABS.RESTOCKS, path: TABS.RESTOCKS, icon: "/icons/restock.svg" },
  {
    label: TABS.TRANSACTION,
    path: TABS.TRANSACTION,
    icon: "/icons/transaction.svg",
  },
];

interface ButtonProps extends NavButtonType {
  currentTab?: string;
  isMobile: boolean;
}

const NavButton = ({
  label,
  path,
  icon,
  currentTab,
  isMobile,
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const isActive = path === currentTab;

  const shouldExpand = (isHovered || isActive) && !isMobile;

  return (
    <button
      className={`cursor-pointer flex items-center p-2 transition-all ease-in-out duration-600 bg-highlight/25 hover:bg-highlight/75 ${
        isHovered || isActive ? "bg-highlight/85 glowBox" : ""
      } ${shouldExpand ? "gap-2" : "gap-0"} rounded-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate("/" + path)}
    >
      <span
        className={`font-bold uppercase whitespace-nowrap overflow-hidden transition-all duration-600 ${
          shouldExpand
            ? "max-w-xs opacity-100"
            : "max-w-0 opacity-0 w-0 text-transparent"
        }`}
      >
        {label}
      </span>
      <img src={icon} alt="" width={25} />
    </button>
  );
};

const LogoutButton = ({ isMobile }: { isMobile: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    const callBack = async () => {
      dispatch(logout());
    };

    openModal(ModalType.CONFIRMATION, ModalAction.CONFIRM, {
      callBack,
      title: "LOGOUT?",
      success: "Logged out",
    });
  };

  const shouldExpand = isHovered && !isMobile;

  return (
    <button
      className={`cursor-pointer flex items-center p-2 rounded-lg bg-highlight/50 hover:bg-highlight/85 transition-all ease-in-out duration-600 ${
        isHovered ? "bg-highlight/85" : ""
      } ${shouldExpand ? "gap-2" : "gap-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleLogout}
    >
      <span
        className={`font-bold whitespace-nowrap overflow-hidden transition-all duration-600 ${
          shouldExpand
            ? "max-w-xs opacity-100"
            : "max-w-0 opacity-0 w-0 text-transparent"
        }`}
      >
        Logout
      </span>
      <img src="/icons/logout.svg" alt="" width={25} />
    </button>
  );
};

const ResetWebAppButton = ({ isMobile }: { isMobile: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { openModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  const handleReset = () => {
    const callBack = async () => {
      dispatch(reset());
    };

    openModal(ModalType.CONFIRMATION, ModalAction.CONFIRM, {
      callBack,
      title: "RESET?",
      success: "DONE",
    });
  };

  const shouldExpand = isHovered && !isMobile;

  return (
    <button
      className={`cursor-pointer flex items-center p-2 rounded-lg bg-highlight/50 hover:bg-highlight/85 transition-all ease-in-out duration-600 ${
        isHovered ? "bg-highlight/85" : ""
      } ${shouldExpand ? "gap-2" : "gap-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleReset}
    >
      <span
        className={`font-bold whitespace-nowrap overflow-hidden transition-all duration-600 ${
          shouldExpand
            ? "max-w-xs opacity-100"
            : "max-w-0 opacity-0 w-0 text-transparent"
        }`}
      >
        RESET
      </span>
      <img src="/icons/reset.svg" alt="" width={25} />
    </button>
  );
};

// --- Main Component ---
export default function GlobalNavigation() {
  const { tab } = useParams();
  const { device } = useSelector((state: RootState) => state.config);
  const isMobile = device === Device.MOBILE;

  return (
    <div className="flex flex-col max-w-full overflow-hidden justify-between h-full p-2">
      <div className="flex flex-col gap-2 items-end">
        {NAV_BUTTONS.map((button) => (
          <NavButton
            key={button.label}
            currentTab={tab}
            isMobile={isMobile}
            {...button}
          />
        ))}
      </div>
      <div className="flex flex-col items-end gap-2">
        <ResetWebAppButton isMobile={isMobile} />
        <LogoutButton isMobile={isMobile} />
      </div>
    </div>
  );
}
