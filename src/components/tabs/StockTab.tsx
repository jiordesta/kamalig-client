import { useEffect, useState } from "react";
import GlobalTable from "../GlobalTable";
import TableButton from "../inputs/TableButton";
import TableCheckBox from "../inputs/TableCheckBox";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../config/redux/store";
import {
  fetchAllStocks,
  fetchStockFlow,
  setStockAsOutOfStock,
} from "../../config/redux/reducers/stock";
import { ModalAction, ModalType, useModal } from "../hooks/UseModal";
import { HEADERTYPES } from "../../libs/enums";
import SelectInput from "../inputs/SelectInput";
import { getProductList } from "../../config/redux/reducers/config";
import toast from "react-hot-toast";

export default function StockTab() {
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();
  const handleTableRefresh = () => {
    setRefresh(!refresh);
  };
  const { products } = useSelector((state: RootState) => state.config);
  const [filters, setFilters] = useState({
    productId: undefined,
    brandId: undefined,
    isDeleted: false,
  });

  const { stocks, showLoading } = useSelector(
    (state: RootState) => state.stock,
  );

  useEffect(() => {
    dispatch(getProductList({ token: token }));
  }, []);

  useEffect(() => {
    dispatch(fetchAllStocks({ token: token, payload: filters }));
  }, [refresh, filters]);

  const handleClearFilters = () => {
    setFilters({
      productId: undefined,
      brandId: undefined,
      isDeleted: false,
    });
  };

  const handleOutOfStock = () => {
    if (selected.length === 0) {
      toast.error("Please select one");
      return;
    }

    const callBack = async () => {
      if (!token) return;
      const selectedIds = selected.join(",");

      return await dispatch(
        setStockAsOutOfStock({ token: token, payload: { selectedIds } }),
      )
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };

    openModal(ModalType.CONFIRMATION, ModalAction.CONFIRM, {
      title: "OUT OF STOCK?",
      callBack: callBack,
    });
  };

  const interactiveButtons = [
    <TableButton
      key="refresh"
      isLoading={showLoading}
      clickHandler={handleTableRefresh}
      icon="refresh"
      spin={true}
    />,
    <TableButton
      key="outofstock"
      isLoading={showLoading}
      clickHandler={handleOutOfStock}
      icon="outofstock"
      spin={false}
    />,
    <div className="w-50" key="productIdFilter">
      <SelectInput
        options={products || []}
        placeholder="What Product?"
        value={filters}
        setter={setFilters}
        dkey={"id"}
        fkey={"productId"}
        labelKey="productName"
      />
    </div>,
    <div className="w-50" key="brandIdFilter">
      <SelectInput
        options={[]}
        placeholder="What Brand?"
        value={filters}
        setter={setFilters}
        dkey={"id"}
        fkey={"brandId"}
        labelKey="brandName"
      />
    </div>,
    <div className="w-50" key="isDeletedFilter">
      <SelectInput
        options={[
          { label: "OUT OF STOCK", value: true },
          { label: "IN STOCK", value: false },
        ]}
        placeholder="What Brand?"
        value={filters}
        setter={setFilters}
        dkey={"value"}
        fkey={"isDeleted"}
        labelKey="label"
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

  const handleShowList = (stockId: number) => {
    const displayHeaders = [
      {
        label: "Receiver",
        dkey: "receiver",
        col: 12,
      },
      {
        label: "Date",
        dkey: "transactionDate",
        col: 8,
        type: "date",
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
        fetchStockFlow({
          token: token,
          payload: { stockId: stockId },
        }),
      )
        .unwrap()
        .then((responseData) => {
          return responseData;
        });
    };

    openModal(ModalType.DISPLAY, ModalAction.DISPLAY, {
      displayHeaders: displayHeaders,
      title: "Stock Flow",
      callBack: callBack,
    });
  };

  const headers = [
    TableCheckBox({
      selected,
      setSelected,
      isSelectedAll,
      setIsSelectedAll,
      data: stocks,
      refresh: refresh,
    }),
    {
      label: "Item",
      dkey: "productName",
      col: 3,
    },
    {
      label: "brand",
      dkey: "brand",
      col: 3,
    },
    {
      label: "Pumasok",
      dkey: "quantity",
      col: 3,
      endLabel: " Boxes",
    },
    {
      label: "Lumabas",
      dkey: "totalOut",
      col: 3,
      endLabel: " Boxes",
    },
    {
      label: "Tira",
      dkey: "stocksLeft",
      col: 3,
      endLabel: " Boxes",
    },
    {
      label: "",
      dkey: "viewOrderItems",
      col: 2,
      type: HEADERTYPES.SHOW,
      displayItemsRenderer: (orderId: number) => (
        <button
          className="cursor-pointer"
          onClick={() => handleShowList(orderId)}
        >
          <img src="/icons/showlist.svg" width={18} alt="" />
        </button>
      ),
    },
  ];

  return (
    <GlobalTable buttons={interactiveButtons} headers={headers} data={stocks} />
  );
}
