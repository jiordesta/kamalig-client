import { useState } from "react";
import { useModal } from "../hooks/UseModal";
import toast from "react-hot-toast";
import GlobalLoader from "../GlobalLoader";
import GlobalModal, { type ModalProps } from "../GlobalModal";

export default function ConfirmationModal({ payload }: ModalProps) {
  const { closeModal } = useModal();

  const handleCallBackCall = async () => {
    setLoading(true);

    try {
      await payload?.callBack(payload);
      toast.success(payload?.success);
      closeModal();
    } catch (err) {
      toast.error(payload?.error);
    } finally {
      setLoading(false);
    }
  };

  const [isLoading, setLoading] = useState(false);

  const interActiveButtons = [
    <button
      key="confirm"
      onClick={handleCallBackCall}
      className="flex gap-2 bg-highlight/75 hover:bg-highlight/50 p-2 rounded-lg cursor-pointer w-full justify-center items-center"
    >
      <img src="/icons/yes.svg" width={20} alt="" />
      CONFIRM
    </button>,
    <button
      key="cancel"
      onClick={closeModal}
      className="flex gap-2 bg-highlight/75 hover:bg-highlight/50 p-2 rounded-lg cursor-pointer w-full justify-center items-center"
    >
      <img src="/icons/no.svg" width={20} alt="" />
      CANCEL
    </button>,
  ];

  return (
    <GlobalModal
      title={payload?.title}
      buttons={interActiveButtons}
      inputs={[]}
      loader={<GlobalLoader showBg={false} isLoading={isLoading} />}
    />
  );
}
