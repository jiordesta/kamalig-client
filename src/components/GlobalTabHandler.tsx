import { TABS } from "../libs/enums";
import OnboardingTab from "./tabs/OnboardingTab";
import ProductTab from "./tabs/ProductTab";
import ReportTab from "./tabs/ReportTab";
import RestockTab from "./tabs/RestockTab";
import StockTab from "./tabs/StockTab";
import TransactionTab from "./tabs/TransactionTab";

interface GlobalTabHandlerProps {
  tab: string | undefined;
}

export default function GlobalTabHandler({ tab }: GlobalTabHandlerProps) {
  return (
    <>
      {(tab === TABS.STOCKS || tab === undefined) && <StockTab />}
      {tab === TABS.PRODUCTS && <ProductTab />}
      {tab === TABS.ONBOARDING && <OnboardingTab />}
      {tab === TABS.RESTOCKS && <RestockTab />}
      {tab === TABS.TRANSACTION && <TransactionTab />}
      {tab === TABS.REPORTS && <ReportTab />}
    </>
  );
}
