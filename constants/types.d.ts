import { NativeStackScreenProps } from "@react-navigation/native-stack";

// home stack navigation
export type HomeStackNavigatorParamList = {
  home: undefined;
  Notifications: undefined;
  Transactions: undefined;
  Withdraw: undefined;
  Deposit: undefined;
  Share: undefined;
  AddFace: undefined;
  FaceScanning: undefined;
  FaceScanner: undefined;
};

export type HomeScreenNavigatorProps = NativeStackScreenProps<
  HomeStackNavigatorParamList,
  home,
  Notification,
  Transactions,
  Withdraw,
  Deposit,
  Share,
  AddFace,
  FaceScanning,
  FaceScanner
>;


export type AppNavigatorProps = Native


 
// Sending stack navigator

export type SendStackNavigatorParamList = {
  SendTo: undefined;
  AmountToSend: undefined;
  DisplaySendInfo: undefined;
  SuccessSend: undefined;
};

export type SendScreenNavigatorProps = NativeStackScreenProps<
  SendStackNavigatorParamList,
  SendTo,
  AmountToSend,
  DisplaySendInfo,
  SuccessSend
>;

// deposit stack navigator

export type DepositStackNavigatorParamList = {
  AmountDeposit: undefined;
  DepositMethod: undefined;
  AddDepositNote: undefined;
  DepositPreview: undefined;
  DepositSuccess: undefined;
};

export type DepositScreenNavigatorProps = NativeStackScreenProps<
  DepositStackNavigatorParamList,
  AmountDeposit,
  DepositMethod,
  AddDepositNote,
  DepositPreview,
  DepositSuccess
>;

// withdraw navigator

export type WithdrawNavigatorParamList = {
  AmountWithdraw: undefined;
  WithdrawMethod: undefined;
  WithdrawPreview: undefined;
  WithdrawSuccess: undefined;
};

export type WithdrawScreenNavigatorProps = NativeStackScreenProps<
  WithdrawNavigatorParamList,
  AmountWithdraw,
  WithdrawMethod,
  WithdrawPreview,
  WithdrawSuccess
>;

// auth stack navigatoe

export type AuthStackNavigatorParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerify: undefined;
  NewPassword: undefined;
  IdVerification: undefined;
  IDPreview: undefined;
  ProfileSetup: undefined;
  FaceScanning: undefined;
  FaceScanner: undefined;
  CompleteAuth: undefined;
};

export type AuthScreenNavigatorProps = NativeStackScreenProps<
  AuthStackNavigatorParamList,
  CompleteAuth,
  Register,
  Login,
  ForgotPassword,
  OTPVerify,
  NewPassword,
  IdVerification,
  IDPreview,
  ProfileSetup,
  FaceScanning,
  FaceScanner,
  CompleteAuth
>;

// contacts Stack navigator
export type ContactStackNavigatorParamList = {
  Contacts: undefined;
  ContactPreview: {
    id: number;
    usernames: string;
    email: string;
    image: any;
  };
  AddContact: undefined;
};

export type ContactScreenNavigatorProps = NativeStackScreenProps<
  ContactStackNavigatorParamList,
  Contacts,
  ContactPreview,
  AddContact
>;

// accout stack navigator

export type AccoutStackNavigatorParamList = {
  Account: undefined;
  Language: undefined;
  Security: undefined;
  Help: undefined;
  PersonalInfo: undefined;
  About: undefined;
};

export type AccountScreenNavigatorProps = NativeStackScreenProps<
  AccoutStackNavigatorParamList,
  Account,
  Security,
  Language,
  Help,
  PersonalInfo,
  About
>;

// Reciepts  navigator

export type ReceiptStackNavigatorParamList = {
  Receipts: undefined;
  ReceiptsDetails: {
    sender: string;
    senderEmail: string;
    recepient: string;
    recepientEmail: string;
    amount: number;
    Date: Date;
    TransactionId: string;
    note: string;
    action: string;
  };
  details: undefined;
};

export type ReceiptsScreenNavigatorProps = NativeStackScreenProps<
  ReceiptStackNavigatorParamList,
  Receipts,
  ReceiptsDetails,
  details
>;

export type responseType = {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  callingCodes: string[];
  flags: {
    svg: string;
    png: string;
  };
};
