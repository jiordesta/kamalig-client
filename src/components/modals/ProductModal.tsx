import { useState } from "react";
import { useModal } from "../hooks/UseModal";
import type { ModalProps } from "../GlobalModal";
import GlobalModal from "../GlobalModal";
import GlobalLoader from "../GlobalLoader";
import toast from "react-hot-toast";
import MultTextInput from "../inputs/MultTextInput";

export default function ProductModal({ payload }: ModalProps) {
  const { closeModal } = useModal();

  const userForm = {
    names: payload?.data?.names || [],
  };

  const [form, setForm] = useState(userForm);
  const [isLoading, setLoading] = useState(false);

  const handleCallBackCall = async () => {
    setLoading(true);
    try {
      await payload?.callBack(form, payload?.data?.id);
      toast.success(payload?.success);
    } catch (err) {
      toast.error(payload?.error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const interActiveButtons = [
    <button
      key="confirm"
      className="bg-highlight/75 hover:bg-highlight/50 w-full p-2 rounded-lg cursor-pointer"
      onClick={handleCallBackCall}
      disabled={isLoading}
    >
      CONFIRM
    </button>,
    <button
      key="cancel"
      className="bg-highlight/75 hover:bg-highlight/50 w-full p-2 rounded-lg cursor-pointer"
      onClick={closeModal}
      disabled={isLoading}
    >
      CANCEL
    </button>,
  ];

  const interActiveInputs = [
    <MultTextInput key="names" value={form} setter={setForm} dkey={"names"} />,
  ];

  return (
    <GlobalModal
      title={payload?.title}
      buttons={interActiveButtons}
      inputs={interActiveInputs}
      loader={<GlobalLoader showBg={false} isLoading={isLoading} />}
    />
  );
}
