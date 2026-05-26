import { useEffect, useState } from "react";
import GlobalTable from "../GlobalTable";
import TableButton from "../inputs/TableButton";
import TableCheckBox from "../inputs/TableCheckBox";
import type { AppDispatch, RootState } from "../../config/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  fetchAllProducts,
  updateProduct,
} from "../../config/redux/reducers/product";
import { ModalAction, ModalType, useModal } from "../hooks/UseModal";

export default function ProductTab() {
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();
  const { products, showLoading } = useSelector(
    (state: RootState) => state.product,
  );

  const handleTableRefresh = () => {
    setRefresh(!refresh);
  };

  const handleAddProduct = () => {
    const callBack = async (payload: any) => {
      if (!token) return;
      return await dispatch(createProduct({ token: token, payload: payload }))
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };
    openModal(ModalType.PRODUCT, ModalAction.CREATE, {
      title: "CREATE NEW PRODUCT",
      callBack: callBack,
      error: "Unable to create product",
      success: "Product Created",
    });
  };

  const handleEditProduct = () => {
    const callBack = async (payload: any, id?: number) => {
      if (!token) return;
      return await dispatch(
        updateProduct({ token: token, payload: payload, id: id }),
      )
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };
    openModal(ModalType.PRODUCT, ModalAction.UPDATE, {
      title: "UPDATE PRODUCT",
      callBack: callBack,
      error: "Update Failed",
      success: "Product Updated",
      data: products.find((product) => product.id === selected[0]),
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
      clickHandler={handleAddProduct}
      icon="add"
      spin={false}
    />,
    <TableButton
      key="edit"
      isLoading={showLoading}
      clickHandler={handleEditProduct}
      icon="edit"
      spin={false}
    />,
  ];

  const headers = [
    TableCheckBox({
      selected,
      setSelected,
      isSelectedAll,
      setIsSelectedAll,
      data: products,
      refresh: refresh,
    }),
    {
      label: "product",
      dkey: "productName",
      col: 3,
    },
    {
      label: "other names",
      dkey: "otherNames",
      col: 3,
    },
  ];

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAllProducts({ token: token }));
  }, [refresh]);

  return (
    <GlobalTable
      buttons={interactiveButtons}
      headers={headers}
      data={products}
    />
  );
}
