import {
  configureStore,
  combineReducers,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { middleWare } from "./middleWare.ts";
import config from "./reducers/config";
import user from "./reducers/user";
import product from "./reducers/product";
import restock from "./reducers/restock";
import stock from "./reducers/stock";
import transaction from "./reducers/transaction";
import auth, { reset } from "./reducers/auth";
import report from "./reducers/report";

const appReducer = combineReducers({
  auth,
  config,
  user,
  product,
  restock,
  stock,
  transaction,
  report: report,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction,
) => {
  if (action.type === reset.type) {
    console.log("got reset");
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleWare),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
