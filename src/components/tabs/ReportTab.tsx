import { useEffect, useState } from "react";
import GlobalTable from "../GlobalTable";
import TableButton from "../inputs/TableButton";
import TableCheckBox from "../inputs/TableCheckBox";
import type { AppDispatch, RootState } from "../../config/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ModalAction, ModalType, useModal } from "../hooks/UseModal";
import {
  createReport,
  displayReport,
  fetchAllReports,
} from "../../config/redux/reducers/report";
import { HEADERTYPES } from "../../libs/enums";

export default function ReportTab() {
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { openModal } = useModal();

  const { reports, showLoading } = useSelector(
    (state: RootState) => state.report,
  );

  const handleAddReport = () => {
    const callBack = async (payload: any) => {
      if (!token) return;
      return await dispatch(createReport({ token: token, payload: payload }))
        .unwrap()
        .then(() => {
          handleTableRefresh();
        });
    };

    openModal(ModalType.REPORT, ModalAction.CREATE, {
      callBack,
      title: "Create Report",
      success: "Created",
      error: "Failed",
    });
  };

  const handleTableRefresh = () => {
    setRefresh(!refresh);
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
      clickHandler={handleAddReport}
      icon="add"
      spin={false}
    />,
  ];

  const handleShowList = (reportId: number) => {
    const displayHeaders = [
      {
        label: "Product",
        dkey: "productName",
        col: 4,
      },
      {
        label: "Brand",
        dkey: "brand",
        col: 7,
      },
      {
        label: "Expected",
        dkey: "itemQuantity",
        col: 5,
      },
      {
        label: "Actual",
        dkey: "reportQuantity",
        col: 5,
      },
      {
        label: "Match?",
        dkey: "match",
        col: 3,
        typeValueRenderer: (value: boolean) => {
          return (
            <h1
              className={`whitespace-nowrap overflow-hidden ${value ? "text-green-500" : "text-red-500"}`}
            >
              {value ? "Yes" : "No"}
            </h1>
          );
        },
      },
    ];

    const callBack = async () => {
      if (!token) return;

      return await dispatch(
        displayReport({
          token: token,
          payload: { reportId: reportId },
        }),
      )
        .unwrap()
        .then((responseData) => {
          return responseData;
        });
    };

    openModal(ModalType.DISPLAY, ModalAction.DISPLAY, {
      displayHeaders: displayHeaders,
      title: `SHOW REPORT`,
      callBack: callBack,
    });
  };

  const headers = [
    TableCheckBox({
      selected,
      setSelected,
      isSelectedAll,
      setIsSelectedAll,
      data: reports,
      refresh: refresh,
    }),
    {
      label: "date",
      dkey: "reportDate",
      col: 3,
      type: HEADERTYPES.DATE,
    },
    {
      label: "",
      dkey: "displayReport",
      col: 2,
      type: HEADERTYPES.SHOW,
      displayItemsRenderer: (reportId: number) => (
        <button
          className="cursor-pointer"
          onClick={() => handleShowList(reportId)}
        >
          <img src="/icons/showlist.svg" width={18} alt="" />
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (!token) return;
    dispatch(fetchAllReports({ token: token }));
  }, [refresh]);

  return (
    <GlobalTable
      buttons={interactiveButtons}
      headers={headers}
      data={reports || []}
    />
  );
}
