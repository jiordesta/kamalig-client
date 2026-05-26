import { useState } from "react";
import { HEADERTYPES } from "../../libs/enums";
import SelectInput from "./SelectInput";

interface TableSelectorProps {
  options: any[];
  placeHolder?: string;
  dkey: string;
  fkey: string;
  labelKey: string;
  format: any;
  label: string;
}

export default function TableSelector({
  options,
  placeHolder,
  dkey,
  fkey,
  labelKey,
  format,
  label,
}: TableSelectorProps) {
  const [form, setForm] = useState(format);

  return {
    label: label,
    dkey: label,
    type: HEADERTYPES.SELECTOR,
    itemRenderer: () => (
      <SelectInput
        options={options}
        placeholder={placeHolder}
        value={form}
        setter={setForm}
        dkey={dkey}
        fkey={fkey}
        labelKey={labelKey}
      />
    ),
    col: 2,
  };
}
