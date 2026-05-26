import { useEffect, useState } from "react";
import { useModal } from "../hooks/UseModal";
import type { ModalProps } from "../GlobalModal";
import GlobalModal from "../GlobalModal";
import GlobalLoader from "../GlobalLoader";
import toast from "react-hot-toast";
import { getItemList, getShopOwners } from "../../config/redux/reducers/config";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../config/redux/store";
import DatePicker from "../inputs/DatePicker";
import SelectInput from "../inputs/SelectInput";
import { getNewDate } from "../../libs/utils";
import FastOrderInput from "../inputs/FastOrderInput";

//TODO: needs to be refactored
export default function TransactionModal({ payload }: ModalProps) {
  console.log(payload);
  const { closeModal } = useModal();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const userForm = {
    userId: payload?.data?.userId,
    transactionDate: getNewDate(),
    items: payload?.data?.transactionItems || [],
  };
  const { items, shopOwners } = useSelector((state: RootState) => state.config);
  const [form, setForm] = useState(userForm);
  const [isLoading, setLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (!token) return;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getItemList({ token })).unwrap(),
          dispatch(getShopOwners({ token })).unwrap(),
        ]);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [refresh, token, dispatch]);

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

  const [activeInput, setActiveInput] = useState();

  const interActiveInputs = [
    <div className="flex flex-col md:flex-row gap-2" key="transactionDetails">
      <div className="w-[60%] md:w-full">
        <DatePicker
          key="transactionDate"
          value={form}
          setter={setForm}
          dkey={"transactionDate"}
        />
      </div>
      <div className="w-[40%] md:w-full">
        <SelectInput
          key="userId"
          options={shopOwners || []}
          placeholder="Who ordered?"
          value={form}
          setter={setForm}
          dkey={"id"}
          fkey={"userId"}
          labelKey="name"
        />
      </div>
    </div>,
    <div
      key="transactionItems"
      className="flex flex-col gap-2 h-50 overflow-auto"
    >
      {items.map((item) => {
        return (
          <FastOrderInput
            key={item.id}
            value={form}
            setter={setForm}
            item={item}
            orderItems={payload?.order?.orderItems}
            activeInput={activeInput}
            setActiveInput={setActiveInput}
          />
        );
      })}
    </div>,
    <div key="refresh">
      <button
        key="refresh"
        className="cursor-pointer flex items-center bg-primary/25 hover:bg-primary/50 px-2 pe-4 rounded-lg"
        onClick={handleRefresh}
        disabled={isLoading}
      >
        <img src="/icons/refresh.svg" width={28} alt="" />
        <span className="ml-2">Refresh</span>
      </button>
    </div>,
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
