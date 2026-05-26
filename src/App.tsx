import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import { store } from "./config/redux/store";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

const Fallback = ({ error }: any) => (
  <div>
    <h2>Something went wrong:</h2>
    <pre>{error.message}</pre>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Provider store={store}>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{ duration: 7500 }}
        />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:tab" element={<HomePage />} />
          </Routes>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}
