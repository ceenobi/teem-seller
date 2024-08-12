import { useContext } from "react";
import { ContextStore } from "@/store";

export const useStore = () => useContext(ContextStore);
