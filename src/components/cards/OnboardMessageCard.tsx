type OnboardMessageCardProps = {
  handleCloseOnboardMessage: () => void;
};

export default function OnboardMessageCard({
  handleCloseOnboardMessage,
}: OnboardMessageCardProps) {
  return (
    <div className="w-full">
      <div className="rounded-lg">
        <h1 className="font-bold w-full text-start text-2xl tracking-widest pb-4">
          NOTICE!
        </h1>
        <p className="text-start text-sm tracking-wide">
          Contact your admin to get your account created.
        </p>
      </div>
      <div className="pt-6">
        <button
          key="confirm"
          className="flex gap-2 bg-highlight/75 hover:bg-highlight/50 p-2 rounded-lg cursor-pointer w-full justify-center items-center"
          onClick={handleCloseOnboardMessage}
        >
          <img src="/icons/yes.svg" width={20} alt="" />
          OK
        </button>
      </div>
    </div>
  );
}
