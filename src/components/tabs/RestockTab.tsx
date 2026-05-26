import { useEffect, useState } from "react";
import GlobalTable from "../GlobalTable";
import TableButton from "../inputs/TableButton";
import TableCheckBox from "../inputs/TableCheckBox";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../config/redux/store";
import { ModalAction, ModalType, useModal } from "../hooks/UseModal";
import {
  createRestock,
  fetchAllRestocks,
} from "../../config/redux/reducers/restock";
import SelectInput from "../inputs/SelectInput";
import { getProductList } from "../../config/redux/reducers/config";

export default function RestockTab() {
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();

  const { products } = useSelector((state: RootState) => state.config);

  const [filters, setFilters] = useState({
    productId: undefined,
    brandId: undefined,
  });

  const { restocks, showLoading } = useSelector(
    (state: RootState) => state.restock,
  );

  const handleTableRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    dispatch(getProductList({ token: token }));
  }, []);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAllRestocks({ token: token, payload: filters }));
  }, [refresh, filters]);

  const handleCreateRestock = () => {
    const callBack = async (payload: any) => {
      if (!token) return;
      return await dispatch(createRestock({ token: token, payload: payload }))
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };
    openModal(ModalType.RESTOCK, ModalAction.CREATE, {
      title: "ADD NEW STOCK",
      callBack: callBack,
      error: "Unable to create restock",
      success: "Restock Created",
    });
  };

  // const handleUpdateRestock = () => {};
  // const handleDeleteRestock = () => {};
  const handleClearFilters = () => {
    setFilters({
      productId: undefined,
      brandId: undefined,
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
      key="add"
      isLoading={showLoading}
      clickHandler={handleCreateRestock}
      icon="add"
      spin={false}
    />,
    // <TableButton
    //   key="update"
    //   isLoading={showLoading}
    //   clickHandler={handleTableRefresh}
    //   icon="edit"
    //   spin={false}
    // />,
    // <TableButton
    //   key="delete"
    //   isLoading={showLoading}
    //   clickHandler={handleTableRefresh}
    //   icon="delete"
    //   spin={false}
    // />,
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
    <TableButton
      key="clear"
      isLoading={showLoading}
      clickHandler={handleClearFilters}
      icon="clear"
      spin={false}
    />,
  ];

  const headers = [
    TableCheckBox({
      selected,
      setSelected,
      isSelectedAll,
      setIsSelectedAll,
      data: restocks,
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
      label: "qty",
      dkey: "quantity",
      col: 2,
    },
    {
      label: "Date",
      dkey: "restockDate",
      col: 4,
      type: "date",
    },
  ];

  return (
    <GlobalTable
      buttons={interactiveButtons}
      headers={headers}
      data={restocks}
    />
  );
}
