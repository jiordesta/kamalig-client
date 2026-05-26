type GlobalLoaderProps = {
  showBg?: boolean;
  isLoading?: boolean;
};

export default function GlobalLoader({
  showBg = true,
  isLoading = false,
}: GlobalLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      className={`w-full h-full ${showBg && "bg-black/50"} rounded-xl inset-0 absolute flex justify-center items-center`}
    >
      <img src="/icons/loading.svg" alt="" width={75} />
    </div>
  );
}
