import type { JSX } from "react";
import { HEADERTYPES } from "../libs/enums";
import { getValueByPath } from "../libs/utils";

interface GlobalTableProps {
  buttons: JSX.Element[];
  headers: any[];
  data: any[];
}
//TODO REFACTOR EVERYTHING
export default function GlobalTable({
  buttons,
  headers,
  data,
}: GlobalTableProps) {
  const Header = () => {
    return (
      <div className="flex gap-2 justify-start items-center">{buttons}</div>
    );
  };

  const TableDataRenderer = ({ header, item }: any) => {
    return (
      <>
        {header.type === HEADERTYPES.SELECTOR &&
          header.itemRenderer &&
          header.itemRenderer(item)}
        {header.type === HEADERTYPES.CHECKBOX &&
          header.itemRenderer &&
          header.itemRenderer(item.id)}
        {header.type === HEADERTYPES.SHOW &&
          header.displayItemsRenderer &&
          header.displayItemsRenderer(item.id)}
        {header.typeValueRenderer ? (
          header.typeValueRenderer(item[header.dkey])
        ) : (
          <h1 className="whitespace-nowrap overflow-hidden">
            {getValueByPath(item, header.dkey, header.type)}
            {header.endLabel || ""}
          </h1>
        )}
      </>
    );
  };

  const Data = ({ item }: any) => {
    return (
      <div className="p-2 z-40 col-span-24 mb-0">
        <ul className="grid grid-cols-24 gap-2 ">
          {headers.map((header: any) => (
            <li
              key={header.label}
              className="overflow-hidden flex items-center justify-start"
              style={{
                gridColumn: `span ${header.col} / span ${header.col}`,
              }}
            >
              <TableDataRenderer header={header} item={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto w-full h-full bg-secondary rounded-lg">
      <div className="min-w-250 p-2">
        <Header />
        <div className="grid grid-cols-24 gap-2 p-2">
          {headers.map((header: any) => (
            <div
              key={header.label}
              style={{
                gridColumn: `span ${header.col} / span ${header.col}`,
              }}
              className="whitespace-nowrap overflow-hidden text-start sticky top-0 font-bold uppercase flex items-center"
            >
              {header.headerRenderer ? header.headerRenderer() : header.label}
            </div>
          ))}
        </div>
        <hr className="mb-2 mx-1" />
        <div className="col-span-24 space-y-2">
          {data.map((item: any) => (
            <Data key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
