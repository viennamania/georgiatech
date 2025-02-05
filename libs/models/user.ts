import { IUser } from "./../interface/user";
import { model, models, Schema } from "mongoose";
import connectMongo from "../services/database";
import Coin from "../enums/coin.enum";
import { de } from "date-fns/locale";

connectMongo();

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  pass1: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  pass2: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  deposit: {
    type: Number,
    required: false,
    default: 0,
  },
  img: {
    type: String,
    required: true,
    default: "enter your image url",
  },
  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  newPassToken: {
    type: String,
    required: false,
    default: "",
  },
  userToken: {
    type: String,
    required: true,
  },
  maticBalance: {
    type: Number,
    required: false,
    default: 0,
  },
  walletAddress: {
    type: String,
    required: false,
    default: "",
  },
  nftWalletAddress: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
  depositName: {
    type: String,
    required: false,
    default: "",
  },
  depositBankName: {
    type: String,
    required: false,
    default: "",
  },
  txid: {
    type: String,
    required: false,
    default: "",
  },
});

export const User = models.User || model("User", UserSchema);



export const getUserByEmail = async (email: string) => {

  console.log("getUserByEmail email", email);

  const user: IUser = (await User.findOne({ email1: email })) as IUser;
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }
};

export const getUserByUsername = async (username: string) => {
  const user: IUser = (await User.findOne({ username: username })) as IUser;
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }
};



export const newUser = async (
  username: string,
  email: string,
  pass1: string,
  pass2: string,
  userToken: string,
  ////walletAddress: string,
  nftWalletAddress: string,
  depositName: string,
  depositBankName: string,
  depositBankAccount: string,
) => {
  
  const checkUserByEmail = await User.find({ email: email });

  if (checkUserByEmail.length > 0) {
    return { success: false, message: "User email already exists" };
  }


  const checkUserByUsername = await User.find({ username: username });

  if (checkUserByUsername.length > 0) {
    return { success: false, message: "User nick name already exists" };
  }



  const user = new User({
    username: username,
    email: email,
    pass1: pass1,
    pass2: pass2,
    userToken: userToken,
    ////walletAddress: walletAddress,
    nftWalletAddress: nftWalletAddress,
    img: "/profile_default.gif",
    depositName: depositName,
    depositBankName: depositBankName,
    depositBankAccount: depositBankAccount,
  });
  
  return await user.save();
};


export const loginUser = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }
};

export const getUser = async (userToken: string) => {
  const user: IUser = (await User.findOne({ userToken: userToken })) as IUser;
  if (user) {
    return { success: true, user };
  } else {
    return { success: false, message: "User not found" };
  }
};

export const getAllUsers = async () => {
  

  // order by _id descending

  const users: IUser[] = (
    await User.find({ status: true }).sort({ _id: -1 })
  ) as IUser[];

  if (users) {
    return { success: true, users };
  } else {
    return { success: false, message: "Users not found" };
  }
};


export const updateUser = async (
  userToken: string,
  //username: string,
  //email: string,
  //pass1: string,
  //pass2: string,
  deposit: number,
  //img: string,
  ///admin: boolean,
  //newPassToken: string,
  //maticBalance: number,
  //walletAddress: string,
) => {


  console.log("updateUser userToken: ", userToken);
  //console.log("updateUser admin: ", admin);

  console.log("updateUser deposit: ", deposit);
  

  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      //username: username,
      //email: email,
      //pass1: pass1,
      //pass2: pass2,
      
      deposit: deposit,

      //img: img,
      
      //admin: admin,

      //newPassToken: newPassToken,
      //maticBalance: maticBalance,
      //walletAddress: walletAddress,
    },
    { new: true }
  )) as IUser;

  if (updatedUser) {
    return { success: true, updatedUser };
  }

  return { success: false, message: "User not found" };
};



export const updateUserProfileImage = async (
  userToken: string,
  img: string,
) => {


  //console.log("updateUserProfileImage userToken: ", userToken);
  //console.log("updateUserProfileImage img: ", img);

  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      img: img,
    },
    { new: true }
  )) as IUser;
  if (updatedUser) {
    return { success: true, updatedUser };
  }
  return { success: false, message: "User not found" };
};


export const updateUserWalletAddress = async (
  userToken: string,
  walletAddress: string,
) => {


  ///console.log("updateUserWalletAddress userToken: ", userToken);

  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      walletAddress: walletAddress,
    },
    { new: true }
  )) as IUser;
  if (updatedUser) {
    return { success: true, updatedUser };
  }
  return { success: false, message: "User not found" };
};


export const deleteUser = async (userToken: string) => {

  const pasifUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      status: false,
    },
    { new: true }
  )) as IUser;

  if (pasifUser) {
    return { success: true, pasifUser };
  }
  
  return { success: false, message: "User not found" };
};



export const makeDepositMatic = async (userToken: string, amount: number) => {
  const updatedUser: IUser = (await User.findOneAndUpdate(
    { userToken: userToken },
    {
      $inc: { maticBalance: amount },
    },
    { new: true }
  )) as IUser;
  if (updatedUser) {
    return { success: true, updatedUser };
  }
  return { success: false, message: "User not found" };
};

export const makeDepositCoin = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.maticBalance < amount) {
    return { success: false, message: `Not Enough ${Coin.name}` };
  }
  user.deposit += amount * Coin.katSayi;
  user.maticBalance -= amount;
  await user.save();
  return { success: true, user };
};







export const makeWinDepositCoin = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  user.deposit += amount;
  await user.save();
  return { success: true, user };
};




export const makeWinDepositCoinByEmail = async (email: string, amount: number, txid: string) => {
  
  console.log("makeWinDepositCoinByEmail email: ", email);
  console.log("makeWinDepositCoinByEmail amount: ", amount);
  console.log("makeWinDepositCoinByEmail txid: ", txid);

  const user = await User.findOne({ email: email });

  console.log("makeWinDepositCoinByEmail user: ", user);

  if (!user) {
    return { success: false, message: "User not found" };
  }
  
  if (user?.txid === txid) {
    return { success: false, message: "Transaction already exists" };
  }

  
  user.deposit += parseInt(amount as any);

  user.txid = txid;

  await user.save();

  return { success: true, user };
};





export const swapToMatic = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.deposit < amount) {
    return { success: false, message: `Not Enough ${Coin.name}` };
  }
  user.deposit -= amount;
  user.maticBalance += amount / Coin.katSayi;
  await user.save();
  return { success: true, user };
};

export const makeWithdrawMatic = async (userToken: string, amount: number) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  if (user.maticBalance < amount) {
    return { success: false, message: "Not Enough Matic" };
  }
  user.maticBalance -= amount;
  await user.save();
  return { success: true, user };
};


export const updateNftWalletAddress = async (userToken: string, nftWalletAddress: string) => {
  const user = await User.findOne({ userToken: userToken });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  user.nftWalletAddress = nftWalletAddress;
  await user.save();
  return { success: true, user };
};
