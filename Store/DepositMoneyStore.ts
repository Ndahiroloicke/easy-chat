import { create } from "zustand";

interface DepositMoneyState {
    amount: number;
    method: {methodName:string,methodNumber:string,methodImage:any} | null; // Deposit method (e.g., "momo", "bank")
    loading: boolean;
    error: string | null;
    setAmount: (amount: number) => void;
    setMethod: (method:{methodName:string,methodNumber:string,methodImage:any}) => void;
    performDeposit: () => Promise<void>;
  }
  
  const useDepositMoneyStore = create<DepositMoneyState>((set) => ({
    amount: 0,
    method: null, // Initialize with an empty string
    loading: false,
    error: null,
    setAmount: (amount) => set(() => ({ amount: amount })),
    setMethod: (method) => set(() => ({ method:method  })),
    performDeposit: async () => {
      
    },
  }));
  
  export default useDepositMoneyStore;