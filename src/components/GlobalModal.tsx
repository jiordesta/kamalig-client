import type { JSX } from "react";
import type { ModalAction } from "./hooks/UseModal";

interface GlobalModalProps {
  title: string;
  buttons: JSX.Element[];
  inputs: JSX.Element[];
  loader: JSX.Element;
}

export type ModalProps = {
  action: ModalAction;
  payload?: any;
};

export default function GlobalModal({
  title,
  buttons,
  inputs,
  loader,
}: GlobalModalProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2 relative p-4">
      <div className="w-full md:w-1/2 lg:w-1/4 bg-secondary p-2 md:p-4 rounded-xl relative glowBox">
        <div className="w-full space-y-2">
          <h1 className="bg-primary p-4 text-center font-bold rounded-lg text-[20px] glowText">
            {title}
          </h1>
          {inputs && <div className="flex flex-col gap-2">{inputs}</div>}
          <div className="flex gap-2 pt-4">{buttons}</div>
        </div>
        {loader}
      </div>
    </div>
  );
}
