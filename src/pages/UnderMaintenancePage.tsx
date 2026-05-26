import GlobalLayout from "../components/GlobalLayout";

export default function UnderMaintenancePage() {
  return (
    <GlobalLayout>
      <div className="w-full h-full flex justify-center items-center">
        <img src="/icons/maintenance.svg" width={50} alt="" />
      </div>
    </GlobalLayout>
  );
}
