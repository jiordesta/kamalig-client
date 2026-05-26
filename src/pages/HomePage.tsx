import { useParams } from "react-router-dom";
import GlobalLayout from "../components/GlobalLayout";
import GlobalTabHandler from "../components/GlobalTabHandler";

export default function HomePage() {
  const { tab } = useParams();

  return (
    <GlobalLayout isAuthenticationRequired={true} showNavigation={true}>
      <GlobalTabHandler tab={tab} />
    </GlobalLayout>
  );
}
