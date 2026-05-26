import { ModalType, type ModalState } from "./hooks/UseModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import DisplayModal from "./modals/DisplayModal";
import ProductModal from "./modals/ProductModal";
import RestockModal from "./modals/RestockModal";
import TransactionModal from "./modals/TransactionModal";
import UserModal from "./modals/UserModal";

interface GlobalModalHandlerProps {
  modal: ModalState | null;
}

export default function GlobalModalHandler({ modal }: GlobalModalHandlerProps) {
  if (!modal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      {modal?.type === ModalType.CONFIRMATION && (
        <ConfirmationModal action={modal.action} payload={modal.payload} />
      )}
      {modal?.type === ModalType.USER && (
        <UserModal action={modal.action} payload={modal.payload} />
      )}
      {modal?.type === ModalType.PRODUCT && (
        <ProductModal action={modal.action} payload={modal.payload} />
      )}
      {modal?.type === ModalType.RESTOCK && (
        <RestockModal action={modal.action} payload={modal.payload} />
      )}
      {modal?.type === ModalType.TRANSACTION && (
        <TransactionModal action={modal.action} payload={modal.payload} />
      )}
      {modal?.type === ModalType.DISPLAY && (
        <DisplayModal action={modal.action} payload={modal.payload} />
      )}
    </div>
  );
}
