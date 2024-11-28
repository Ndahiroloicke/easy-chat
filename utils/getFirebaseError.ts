export const getFirebaseErrorMessage = (code: string) => {
  var message = null;
  switch (code) {
    case "auth/user-not-found":
      message = "User doesn't exist.";
      break;
    case "auth/email-already-in-use":
      message = "Email already exist";
      break;
    case "auth/invalid-credential":
      message = "Invalid Credential";
      break;
    case "auth/invalid-email":
      message = "Invalid Email";
      break;
    case "auth/invalid-password":
      message = "Incorrect Password";
      break;
    case "auth/too-many-requests":
      message = "You're exceed the limit. Try again after sometime.";
      break;
    default:
      message = "Something went wrong";
      break;
  }
  return message;
};
