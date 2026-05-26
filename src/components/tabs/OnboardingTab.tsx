import { useEffect, useState } from "react";
import GlobalTable from "../GlobalTable";
import TableButton from "../inputs/TableButton";
import TableCheckBox from "../inputs/TableCheckBox";
import { ModalAction, ModalType, useModal } from "../hooks/UseModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../config/redux/store";
import {
  createUser,
  deleteUser,
  fetchAllUsers,
  updateUser,
} from "../../config/redux/reducers/user";
import toast from "react-hot-toast";
import SelectInput from "../inputs/SelectInput";
import { getRoles } from "../../config/redux/reducers/config";

export default function OnboardingTab() {
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { openModal } = useModal();
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [filters, setFilters] = useState({
    roleId: undefined,
  });
  const { showLoading, users } = useSelector((state: RootState) => state.user);

  const { roles } = useSelector((state: RootState) => state.config);

  useEffect(() => {
    dispatch(getRoles({ token: token }));
  }, []);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAllUsers({ token: token, payload: filters }));
  }, [refresh, filters]);

  const handleTableRefresh = () => {
    setRefresh(!refresh);
  };
  const handleCreateNewUser = () => {
    const callBack = async (payload: any) => {
      if (!token) return;
      return await dispatch(createUser({ token: token, payload: payload }))
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };
    openModal(ModalType.USER, ModalAction.CREATE, {
      title: "ONBOARD NEW USER",
      callBack: callBack,
      error: "Failed to create user",
      success: "User created",
    });
  };
  const handleDeleteUser = () => {
    if (selected.length === 0) {
      toast.error("Please select user");
      return;
    }

    const callBack = async () => {
      if (!token) return;
      const selectedIds = selected.join(",");

      return await dispatch(
        deleteUser({ token: token, payload: { selectedIds } }),
      )
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };

    openModal(ModalType.CONFIRMATION, ModalAction.DELETE, {
      title: "DELETE USER?",
      callBack: callBack,
      success: "Deleted",
      error: "Failed to delete",
    });
  };
  const handleEditUser = () => {
    if (selected.length !== 1) {
      toast.error("Please select one user");
      return;
    }
    const callBack = async (payload: any, id?: number) => {
      if (!token) return;
      return await dispatch(
        updateUser({ token: token, payload: payload, id: id }),
      )
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };

    openModal(ModalType.USER, ModalAction.UPDATE, {
      title: "UPDATE USER INFO",
      callBack: callBack,
      success: "User updated",
      error: "User update failed",
      data: users.find((user) => user.id === selected[0]),
    });
  };

  const handleClearFilters = () => {
    setFilters({
      roleId: undefined,
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
      key="newuser"
      isLoading={false}
      clickHandler={handleCreateNewUser}
      icon="add"
      spin={true}
    />,
    <TableButton
      key="edituser"
      isLoading={false}
      clickHandler={handleEditUser}
      icon="edit"
      spin={true}
    />,
    <TableButton
      key="deleteuser"
      isLoading={false}
      clickHandler={handleDeleteUser}
      icon="delete"
      spin={true}
    />,
    <div className="w-50" key="roleIdFilter">
      <SelectInput
        options={roles || []}
        placeholder="What Role?"
        value={filters}
        setter={setFilters}
        dkey={"id"}
        fkey={"roleId"}
        labelKey="name"
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
      data: users,
      refresh: refresh,
    }),
    {
      label: "username",
      dkey: "username",
      col: 3,
    },
    {
      label: "first name",
      dkey: "fname",
      col: 3,
    },
    {
      label: "last name",
      dkey: "lname",
      col: 3,
    },
    {
      label: "role",
      dkey: "role",
      col: 3,
    },
    // {
    //   label: "balance",
    //   dkey: "balance",
    //   col: 3,
    //   endLabel: " PHP",
    // },
  ];

  return (
    <GlobalTable buttons={interactiveButtons} headers={headers} data={users} />
  );
}
