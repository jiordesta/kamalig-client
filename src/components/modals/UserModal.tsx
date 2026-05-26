import { useEffect, useState } from "react";
import { useModal } from "../hooks/UseModal";
import TextInput from "../inputs/TextInput";
import type { ModalProps } from "../GlobalModal";
import GlobalModal from "../GlobalModal";
import GlobalLoader from "../GlobalLoader";
import toast from "react-hot-toast";
import SelectInput from "../inputs/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../config/redux/store";
import { getRoles } from "../../config/redux/reducers/config";

export default function UserModal({ payload }: ModalProps) {
  const { closeModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { roles } = useSelector((state: RootState) => state.config);
  const userForm = {
    fname: payload?.data?.fname,
    lname: payload?.data?.lname,
    roleId: payload?.data?.roleId,
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

  useEffect(() => {
    dispatch(getRoles({ token: token }));
  }, []);

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
    <TextInput
      key="fname"
      label="first name"
      placeholder="first Name"
      value={form}
      setter={setForm}
      dkey={"fname"}
    />,
    <TextInput
      key="lname"
      label="last name"
      placeholder="last Name"
      value={form}
      setter={setForm}
      dkey={"lname"}
    />,
    <SelectInput
      key="roleId"
      options={roles || []}
      placeholder="Role Type?"
      value={form}
      setter={setForm}
      dkey={"id"}
      fkey={"roleId"}
      labelKey="name"
    />,
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
