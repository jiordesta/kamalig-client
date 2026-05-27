import { useEffect } from "react";
import { HEADERTYPES } from "../../libs/enums";

interface TableCheckBoxProps {
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  isSelectedAll: boolean;
  setIsSelectedAll: React.Dispatch<React.SetStateAction<boolean>>;
  data: any[];
  refresh: boolean;
}

export default function TableCheckBox({
  selected,
  setSelected,
  isSelectedAll,
  setIsSelectedAll,
  data,
  refresh,
}: TableCheckBoxProps) {
  const handleSelect = (selectedId: number) => {
    if (selected.includes(selectedId)) {
      if (isSelectedAll) setIsSelectedAll(false);
      setSelected(selected.filter((id) => id !== selectedId));
    } else {
      setSelected([...selected, selectedId]);
    }
  };

  useEffect(() => {
    if (isSelectedAll) {
      setSelected(data?.map((item) => item.id));
    } else {
      if (selected?.length === data?.length) setSelected([]);
    }
  }, [isSelectedAll, refresh]);

  return {
    label: "select",
    dkey: "select",
    type: HEADERTYPES.CHECKBOX,
    itemRenderer: (selectedId: number) => (
      <input
        type="checkbox"
        className="rounded-full cursor-pointer"
        checked={selected.includes(selectedId)}
        onChange={() => handleSelect(selectedId)}
      />
    ),
    headerRenderer: () => (
      <input
        type="checkbox"
        className="rounded-full cursor-pointer"
        checked={isSelectedAll}
        onChange={() => setIsSelectedAll(!isSelectedAll)}
      />
    ),
    col: 1,
  };
}
