// Replace your current file structure with this cleaner setup:
import { useEffect, useState } from "react";
import { updateFormField, upsertItem, type AnyForm } from "../../libs/utils";
import toast from "react-hot-toast";

interface FastOrderInputProps {
  item: any;
  value: AnyForm;
  setter: any;
  activeInput: any;
  items: any;
  setActiveInput: React.Dispatch<React.SetStateAction<any>>;
}

export default function FastOrderInput({
  item,
  value,
  setter,
  activeInput,
  setActiveInput,
}: FastOrderInputProps) {
  const [isActive, setIsActive] = useState(false);
  const [wasClicked, setWasClicked] = useState(false);

  const { id, productName, brand, quantity } = item;

  const currentFormItem = value?.items?.find((i: any) => i.itemId === id) || {
    itemId: id,
    quantity: 0,
    additional: [] as number[],
  };

  const currentQuantity = currentFormItem.quantity;
  const currentAdditional = currentFormItem.additional;

  useEffect(() => {
    if (activeInput?.id !== id) {
      if (isActive && currentQuantity !== 0) {
        setWasClicked(true);

        const lastAdditionalValue =
          currentAdditional[currentAdditional.length - 1];
        if (!lastAdditionalValue || lastAdditionalValue !== 0) {
          const updatedAdditional = [...currentAdditional, 0];
          updateParent({ additional: updatedAdditional });
        }
      }
      setIsActive(false);
    }
  }, [activeInput]);

  const updateParent = (updatedFields: Partial<typeof currentFormItem>) => {
    const nextItemState = { ...currentFormItem, ...updatedFields };
    const updatedItemsList = upsertItem(
      value.items || [],
      nextItemState,
      "itemId",
    );
    updateFormField("items", updatedItemsList, setter);
  };

  const onUpdate = (input: number) => {
    if (input < 0 && currentQuantity <= 0) {
      toast.error("Invalid");
      return;
    }

    if (input === 0) {
      setWasClicked(false);
      updateParent({ quantity: 0, additional: [] });
      return;
    }

    if (wasClicked) {
      const lastIndex = currentAdditional.length - 1;
      const newAdditional = [...currentAdditional];
      newAdditional[lastIndex] = (newAdditional[lastIndex] || 0) + input;
      updateParent({ additional: newAdditional });
    } else {
      updateParent({ quantity: currentQuantity + input });
    }
  };

  const FastOrderNumberInput = () => {
    const buttonStyle =
      "bg-highlight/50 rounded-lg w-14 cursor-pointer hover:bg-highlight/75 transition-all duration-300";

    return (
      <div className="flex gap-2">
        <div className="flex flex-row gap-2 justify-end w-full">
          <button className={buttonStyle} onClick={() => onUpdate(0)}>
            clear
          </button>
          <button className={buttonStyle} onClick={() => onUpdate(-1)}>
            -1
          </button>
          <button className={buttonStyle} onClick={() => onUpdate(1)}>
            +1
          </button>
          <button className={buttonStyle} onClick={() => onUpdate(5)}>
            +5
          </button>
          <button className={buttonStyle} onClick={() => onUpdate(10)}>
            +10
          </button>
          <button className={buttonStyle} onClick={() => onUpdate(100)}>
            +100
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-primary/75 rounded-lg text-c4 flex flex-col whitespace-nowrap transition-all duration-300 ease-in-out">
      <div
        className="grid grid-cols-24 w-full px-4 p-2 cursor-pointer rounded-lg bg-primary"
        onClick={() => {
          setIsActive(!isActive);
          setActiveInput(item);
        }}
      >
        <h1 className="col-span-4 font-bold uppercase">{`${quantity}`}</h1>
        <h1 className="col-span-4 font-bold uppercase">{productName}</h1>
        <h1 className="col-span-4 font-bold uppercase">{brand}</h1>
        <div className="col-span-12 flex gap-2 w-full justify-end">
          {currentQuantity > 0 && <h1>{currentQuantity}box</h1>}
          <div className="flex gap-2">
            {currentAdditional?.map((additional: any, index: any) => {
              if (additional === 0) return null;
              return (
                <div key={index}>
                  <h1>+{additional}box</h1>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-250 ease-in-out ${isActive ? "max-h-40" : "max-h-0"}`}
      >
        <div className="px-4 p-2">
          <FastOrderNumberInput />
        </div>
      </div>
    </div>
  );
}
