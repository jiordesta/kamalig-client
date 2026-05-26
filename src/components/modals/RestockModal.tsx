import { useEffect, useState } from "react";
import { useModal } from "../hooks/UseModal";
import TextInput from "../inputs/TextInput";
import type { ModalProps } from "../GlobalModal";
import GlobalModal from "../GlobalModal";
import GlobalLoader from "../GlobalLoader";
import toast from "react-hot-toast";
import SelectInput from "../inputs/SelectInput";
import NumberInput from "../inputs/NumberInput";
import type { AppDispatch, RootState } from "../../config/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getNewDate } from "../../libs/utils";
import DatePicker from "../inputs/DatePicker";
import { getProductList } from "../../config/redux/reducers/config";

export default function UserModal({ payload }: ModalProps) {
  const { closeModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();

  const userForm = {
    restockDate: payload?.data?.restockDate || getNewDate(),
    productId: payload?.data?.productId,
    brand: payload?.data?.brand,
    quantity: payload?.data?.quantity,
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

  const { products } = useSelector((state: RootState) => state.config);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getProductList({ token: token }));
  }, []);

  const interActiveInputs = [
    <DatePicker value={form} setter={setForm} dkey={"restockDate"} />,
    <SelectInput
      options={products}
      placeholder="Select Product"
      value={form}
      setter={setForm}
      dkey={"id"}
      fkey={"productId"}
      labelKey="productName"
      disabled={false}
    />,
    <TextInput
      label="Brand"
      placeholder="Enter Product Brand"
      value={form}
      setter={setForm}
      dkey={"brand"}
    />,
    <NumberInput
      label="Quantity"
      placeholder="Enter Quantity"
      value={form}
      setter={setForm}
      dkey={"quantity"}
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
