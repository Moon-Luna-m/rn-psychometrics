import NotificationToast from "@/components/NotificationToast";
import { Provider } from "react-redux";
import { InitializationWrapper } from "../components/InitializationWrapper";
import store from "./index";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationToast />
      <InitializationWrapper>
        {children}
      </InitializationWrapper>
    </Provider>
  );
}
