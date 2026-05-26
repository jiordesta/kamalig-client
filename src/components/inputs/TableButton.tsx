interface TableButtonProps {
  isLoading: boolean;
  clickHandler: () => void;
  icon: string;
  spin?: boolean;
}

export default function TableButton({
  isLoading,
  clickHandler,
  icon,
  spin = false,
}: TableButtonProps) {
  return (
    <button
      className={`${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={isLoading}
      onClick={clickHandler}
    >
      <img
        src={`/icons/${icon}.svg`}
        className={`${isLoading && spin && "spin"}`}
        width={30}
        alt=""
      />
    </button>
  );
}
