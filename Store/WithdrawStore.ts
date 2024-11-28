import { create } from "zustand";

interface WithdrawMoneyState {
    amount: number;
    method: {methodName:string,methodNumber:string,methodImage:any} | null; // Deposit method (e.g., "momo", "bank")
    loading: boolean;
    error: string | null;
    setAmount: (amount: number) => void;
    setMethod: (method:{methodName:string,methodNumber:string,methodImage:any}) => void;
    performWithdrawal: () => Promise<void>;
  }
  
  const useWithdrawMoneyStore = create<WithdrawMoneyState>((set) => ({
    amount: 0,
    method: null, // Initialize with an empty string
    loading: false,
    error: null,
    setAmount: (amount) => set(() => ({ amount: amount })),
    setMethod: (method) => set(() => ({ method:method  })),
    performWithdrawal: async () => {
      
    },
  }));

  export default useWithdrawMoneyStore;