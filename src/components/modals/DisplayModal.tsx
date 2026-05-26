import { useEffect, useState } from "react";
import { useModal } from "../hooks/UseModal";
import type { ModalProps } from "../GlobalModal";
import GlobalModal from "../GlobalModal";
import GlobalLoader from "../GlobalLoader";
import toast from "react-hot-toast";
import { getValueByPath } from "../../libs/utils";

export default function DisplayModal({ payload }: ModalProps) {
  const { closeModal } = useModal();

  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };
  const handleCallBackCall = async () => {
    setLoading(true);
    try {
      const res = await payload?.callBack();
      setData(res);
    } catch (err) {
      toast.error(payload?.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCallBackCall();
  }, [refresh]);

  const interActiveButtons = [
    <button
      key="cancel"
      className="bg-highlight/75 hover:bg-highlight/50 w-full p-2 rounded-lg cursor-pointer"
      onClick={closeModal}
      disabled={isLoading}
    >
      CLOSE
    </button>,
  ];

  const interActiveInputs = [
    <div
      key="displayHeaders"
      className="grid grid-cols-24 w-full text-start bg-primary rounded-lg p-2"
    >
      {payload?.displayHeaders?.map((header: any) => (
        <h1
          key={header.label}
          className="whitespace-nowrap overflow-hidden text-start sticky top-0 font-bold uppercase flex items-center"
          style={{
            gridColumn: `span ${header.col} / span ${header.col}`,
          }}
        >
          {header.label}
        </h1>
      ))}
    </div>,
    <div key="data" className="space-y-2 h-50 overflow-auto">
      {data?.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className="grid grid-cols-24 bg-primary/25 rounded-lg p-2"
          >
            {payload?.displayHeaders?.map((header: any) => (
              <h1
                key={header.label}
                className="whitespace-nowrap overflow-hidden"
                style={{
                  gridColumn: `span ${header.col} / span ${header.col}`,
                }}
              >
                {header.typeValueRenderer
                  ? header.typeValueRenderer(
                      getValueByPath(item, header.dkey, header.type),
                    )
                  : getValueByPath(item, header.dkey, header.type)}
              </h1>
            ))}
          </div>
        );
      })}
    </div>,
    <div key="refresh" className="">
      <button
        key="close"
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
