interface User {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  sex: string;
  age: string;
  username?: string;
  profile?: string;
}

interface UserData extends User {
  authToken?: string;
  refreshToken?: string;
  password?: string ;
}
