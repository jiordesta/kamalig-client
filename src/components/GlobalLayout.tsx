import { useEffect, useState } from "react";
import {
  ModalAction,
  ModalContext,
  ModalType,
  type ModalState,
} from "./hooks/UseModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../config/redux/store";
import { authenticate } from "../config/redux/reducers/auth";
import GlobalAuth from "./GlobalAuth";
import { Device, setDevice } from "../config/redux/reducers/config";
import GlobalNavigation from "./GlobalNavigation";
import { isMobile } from "react-device-detect";
import GlobalModalHandler from "./GlobalModalHandler";

type GlobalLayoutProps = {
  children: React.ReactNode;
  isAuthenticationRequired?: boolean;
  showLoader?: boolean;
  showNavigation?: boolean;
};

export default function GlobalLayout({
  children,
  isAuthenticationRequired = false,
  showNavigation = false,
}: GlobalLayoutProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [modal, setModal] = useState<ModalState | null>(null);
  const openModal = (type: ModalType, action: ModalAction, payload?: any) => {
    setModal({ type, action, payload });
  };
  const closeModal = () => setModal(null);
  const { token } = useSelector((state: RootState) => state.auth);
  const { device } = useSelector((state: RootState) => state.config);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    dispatch(setDevice(isMobile));
  }, [isMobile]);

  useEffect(() => {
    if (isAuthenticationRequired) {
      if (!token) {
        setShowAuth(true);
      } else {
        dispatch(authenticate({ token: token })).then((res: any) => {
          if (res.error) {
          } else {
            setShowAuth(false);
          }
        });
      }
    }
  }, [token]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <main
        className={`
        h-screen
        w-full
        relative
        overflow-hidden
        text-light
        bg-primary
					${
            device === Device.MOBILE
              ? "p-2 text-[10px]"
              : "p-2 md:p-4 lg:p-4 w-full text-[12px]"
          }
      `}
      >
        <div className="w-full h-full flex">
          {showNavigation && (
            <div className={device === Device.MOBILE ? "min-w-13" : "min-w-40"}>
              <GlobalNavigation />
            </div>
          )}
          <div className="w-full h-full">{children}</div>
        </div>
        {showAuth && <GlobalAuth />}
        <GlobalModalHandler modal={modal} />
      </main>
    </ModalContext.Provider>
  );
}
