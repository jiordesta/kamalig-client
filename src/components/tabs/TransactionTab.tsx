import { useEffect, useState } from "react";
import GlobalTable from "../GlobalTable";
import TableButton from "../inputs/TableButton";
import TableCheckBox from "../inputs/TableCheckBox";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../config/redux/store";
import { ModalAction, ModalType, useModal } from "../hooks/UseModal";
import {
  createTransaction,
  fetchAllTransactions,
  fetchTransactionItems,
  updateTransaction,
} from "../../config/redux/reducers/transaction";
import { HEADERTYPES } from "../../libs/enums";
import SelectInput from "../inputs/SelectInput";
import { getShopOwners } from "../../config/redux/reducers/config";
import DatePicker from "../inputs/DatePicker";
import { getNewDate } from "../../libs/utils";

export default function TransactionTab() {
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();
  const handleTableRefresh = () => {
    setRefresh(!refresh);
  };

  const [filters, setFilters] = useState<any>({
    userId: undefined,
    transactionDate: getNewDate(),
  });

  const { shopOwners } = useSelector((state: RootState) => state.config);

  const handleClearFilters = () => {
    setFilters({
      userId: undefined,
      transactionDate: undefined,
    });
  };

  const handleCreateTransaction = () => {
    const callBack = async (payload: any) => {
      if (!token) return;
      return await dispatch(
        createTransaction({ token: token, payload: payload }),
      )
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };
    openModal(ModalType.TRANSACTION, ModalAction.CREATE, {
      title: "CREATE NEW TRANSACTION",
      callBack: callBack,
      error: "Unable to create transaction",
      success: "Transaction Created",
    });
  };

  const handleUpdateTransaction = () => {
    const callBack = async (payload: any, transactionId?: number) => {
      if (!token) return;
      return await dispatch(
        updateTransaction({
          token: token,
          payload: payload,
          id: transactionId,
        }),
      )
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };
    openModal(ModalType.TRANSACTION, ModalAction.UPDATE, {
      title: "UPDATE TRANSACTION",
      callBack: callBack,
      error: "Unable to update transaction",
      success: "Transaction Updated",
      data: transactions.find((item) => item.id === selected[0]),
    });
  };

  const { transactions, showLoading } = useSelector(
    (state: RootState) => state.transaction,
  );

  useEffect(() => {
    dispatch(getShopOwners({ token: token }));
  }, []);

  useEffect(() => {
    dispatch(fetchAllTransactions({ token: token, payload: filters }));
  }, [refresh, filters]);

  const interactiveButtons = [
    <TableButton
      key="refresh"
      isLoading={showLoading}
      clickHandler={handleTableRefresh}
      icon="refresh"
      spin={true}
    />,
    <TableButton
      key="add"
      isLoading={showLoading}
      clickHandler={handleCreateTransaction}
      icon="add"
      spin={false}
    />,
    <TableButton
      key="edit"
      isLoading={showLoading}
      clickHandler={handleUpdateTransaction}
      icon="edit"
      spin={false}
    />,
    <div key="shopOwners" className="w-50">
      <SelectInput
        options={shopOwners || []}
        placeholder="Who ordered?"
        value={filters}
        setter={setFilters}
        dkey={"id"}
        fkey={"userId"}
        labelKey="name"
      />
    </div>,
    <div key="transactionDate" className="w-75">
      <DatePicker
        key="transactionDate"
        value={filters}
        setter={setFilters}
        dkey={"transactionDate"}
      />
    </div>,
    <TableButton
      key="clear"
      isLoading={showLoading}
      clickHandler={handleClearFilters}
      icon="clear"
      spin={false}
    />,
  ];

  const handleShowList = (transactionId: number) => {
    const displayHeaders = [
      {
        label: "Name",
        dkey: "productName",
        col: 8,
      },
      {
        label: "Brand",
        dkey: "brand",
        col: 12,
      },
      {
        label: "QTY",
        dkey: "quantity",
        col: 4,
      },
    ];

    const callBack = async () => {
      if (!token) return;

      return await dispatch(
        fetchTransactionItems({
          token: token,
          payload: { transactionId: transactionId },
        }),
      )
        .unwrap()
        .then((responseData) => {
          return responseData;
        });
    };

    openModal(ModalType.DISPLAY, ModalAction.DISPLAY, {
      displayHeaders: displayHeaders,
      title: "Transaction Details",
      callBack: callBack,
    });
  };

  const headers = [
    TableCheckBox({
      selected,
      setSelected,
      isSelectedAll,
      setIsSelectedAll,
      data: transactions,
      refresh: refresh,
    }),
    {
      label: "Name",
      dkey: "name",
      col: 3,
    },
    {
      label: "Date",
      dkey: "transactionDate",
      col: 3,
      type: "date",
    },
    {
      label: "",
      dkey: "viewOrderItems",
      col: 2,
      type: HEADERTYPES.SHOW,
      displayItemsRenderer: (transactionId: number) => (
        <button
          className="cursor-pointer"
          onClick={() => handleShowList(transactionId)}
        >
          <img src="/icons/showlist.svg" width={18} alt="" />
        </button>
      ),
    },
  ];

  return (
    <GlobalTable
      buttons={interactiveButtons}
      headers={headers}
      data={transactions}
    />
  );
}
