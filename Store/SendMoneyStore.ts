import { create } from "zustand";

interface SendMoneyStore{
    selectedUser:{username:string,email:string,image:any} | null;
    amount:number;
    loading:boolean;
    error:string | null;
    setSelectedUser:(user:{username:string,email:string,image:any} )=>void;
    setAmount:(amount:number)=>void;
    performTransaction:()=>Promise<void>;
}


const useSendMoneyStore = create<SendMoneyStore>((set)=>({
    selectedUser: null,
    amount: 0,
    loading: false,
    error: null,
    setSelectedUser: (user) => set(() => ({ selectedUser: user })),
    setAmount: (amount) => set(() => ({ amount: amount })),
    performTransaction: async () => {
      // Your transaction logic
    },
}))

export default useSendMoneyStore;