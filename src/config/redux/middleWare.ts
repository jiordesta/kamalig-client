import type { Middleware } from "@reduxjs/toolkit";
import { saveToStorage } from "../../libs/storage";

export const middleWare: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  if (action.type.startsWith("config/")) {
    const state = store.getState();
    saveToStorage("config", state.config);
  }

  if (action.type.startsWith("auth/")) {
    const state = store.getState();
    saveToStorage("auth", state.auth);
  }

  if (action.type.startsWith("/auth/") && action.type.endsWith("/fulfilled")) {
    const state = store.getState();
    saveToStorage("auth", state.auth);
  }

  if (
    action.type.startsWith("/product/") &&
    action.type.endsWith("/fulfilled")
  ) {
    const state = store.getState();
    saveToStorage("product", state.product);
  }

  if (
    action.type.startsWith("/transaction/") &&
    action.type.endsWith("/fulfilled")
  ) {
    const state = store.getState();
    saveToStorage("transaction", state.transaction);
  }

  if (action.type.startsWith("/stock/") && action.type.endsWith("/fulfilled")) {
    const state = store.getState();
    saveToStorage("stock", state.stock);
  }

  if (
    action.type.startsWith("/restock/") &&
    action.type.endsWith("/fulfilled")
  ) {
    const state = store.getState();
    saveToStorage("restock", state.restock);
  }

  if (action.type.startsWith("/user/") && action.type.endsWith("/fulfilled")) {
    const state = store.getState();
    saveToStorage("user", state.user);
  }

  if (
    action.type.startsWith("/config/") &&
    action.type.endsWith("/fulfilled")
  ) {
    const state = store.getState();
    saveToStorage("config", state.config);
  }

  if (
    action.type.startsWith("/transaction/") &&
    action.type.endsWith("/fulfilled")
  ) {
    const state = store.getState();
    saveToStorage("transaction", state.transaction);
  }
  return result;
};
