import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider, Spinner } from "@nextui-org/react";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Spinner
              size="lg"
              label={"Loading..."}
              color="danger"
              labelColor="danger"
            />
          </div>
        }
      >
        <Provider store={store}>
          <NextUIProvider>
            <Toaster />
            <App />
          </NextUIProvider>
        </Provider>
      </Suspense>
    </I18nextProvider>
  </StrictMode>
);
