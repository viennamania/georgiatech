import { IUser } from "./../../libs/interface/user";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserByUsername,
  getUser,
  loginUser,
  newUser,
  updateUser,
  updateUserProfileImage,
  updateUserWalletAddress,
} from "@/libs/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  ///console.log("api user req.body", req.body);


  const { method, API_KEY } = req.body;
  if (API_KEY !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  //console.log("api user method", method);


  if (method === "checkDuplicationEmail") {
    const { email } = req.body;

    const user = await getUserByEmail(email);


    if (!user.success) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    //console.log("api user", user);

    //const users = await getAllUsers();
    //console.log("api users", users);

    res.status(200).json({ message: "User found", user: true });
  }



  if (method === "create") {

    const { username, email, pass1, pass2, userToken, nftWalletAddress } =
      req.body;

    if (
      !username ||
      !email ||
      !pass1 ||
      !pass2 ||
      !userToken ||
      !nftWalletAddress
    ) {
      res.status(400).json({ status: false, message: "Missing data" });
      return;
    }


    /*
    const checkDuplicationEmail = await getUserByEmail(email);

    console.log("checkDuplicationEmail", checkDuplicationEmail)

    if (checkDuplicationEmail.success) {
      res.status(400).json({ message: "Email is duplicated" });
      return;
    }

    const checkDuplicationUsername = await getUserByUsername(username);
    if (checkDuplicationUsername.success) {
      res.status(400).json({ message: "Nick Name is duplicated" });
      return;
    }
    */



    if (pass1 !== pass2) {
      res
        .status(400)
        .json({ status: false, message: "Passwords do not match" });
      return;
    }

    if (pass1.length < 6) {
      res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters",
      });
      return;
    }


    const user = await newUser(
      username,
      email,
      pass1,
      pass2,
      userToken,
      ///depositWallet,
      nftWalletAddress
    );

    console.log("newUser user", user)



    if (!user) {
      res.status(400).json({ status: false, message: user.message });
      return;
    }

    if (user.success === false) {
      res.status(400).json({ status: false, message: user.message });
      return;
    }

    res.status(200).json({ status: true, message: "User created", user: user });
  }



  if (method === "login") {

    const { email, pass } = req.body;
    const user = await loginUser(email);
    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }
    if (user.user.pass1 !== pass) {
      res.status(400).json({ message: "Wrong password" });
      return;
    }

    res.status(200).json({ message: "User logged in", user: user });

  }






  if (method === "getOne") {
    const { userToken } = req.body;

    const user = await getUser(userToken);

    ////console.log("api user", user);


    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }

    //console.log("api user", user);

    //const users = await getAllUsers();
    //console.log("api users", users);

    res.status(200).json({ message: "User found", user: user });
  }


  if (method === "getAll") {
    const users = await getAllUsers();
    if (!users.success) {
      res.status(400).json({ message: users.message });
      return;
    }
    res.status(200).json({ message: "Users found", users: users });
  }



  if (method === "update") {

    const {
      userToken,
      //username,
      //email,
      //pass1,
      //pass2,
      //deposit,
      //img,
      admin,
      //newPassToken,
      //maticBalance,
      //walletAddress,
    } = req.body;

    console.log("update userToken", userToken)

    const user = await updateUser(
      userToken,
      //username,
      //email,
      //pass1,
      //pass2,
      //deposit,
      //img,
      admin,
      //newPassToken,
      //maticBalance,
      //walletAddress
    );

    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }
    res.status(200).json({ message: "User updated", user: user });
  }


  if (method === "updateProfileImage") {

    const {
      userToken,
      img
    } = req.body;

    const user = await updateUserProfileImage(
      userToken,
      img,
    );
    
    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }
    res.status(200).json({ message: "User updated", user: user });
  }


  if (method === "updateWalletAddress") {

    const {
      userToken,
      authCode,
    } = req.body;


    var depositWallet = "";


  /*
  {"result":"ok","walletaddress":{"walletaddress":"0x52b148e597D131A955B6dE042e75E002bD95B2ED"}}
  */


    const response = await fetch(`http://wallet.treasureverse.io/cracle`);

    
    
    if (response.ok) {

      const json = await response.json();
      
      console.log("login wallet json",json);

      if (json) {
        //nftsGlobal.stakingCountGlobal = json.stakingCountGlobal;
        //nftsGlobal.miningAmountGlobal = json.miningAmountGlobal;

        depositWallet = json.walletaddress;

      }

    } else {
      console.log("HTTP-Error: " + response.status);
    }    
    

    const user = await updateUserWalletAddress(
      userToken,
      depositWallet,
    );
    
    if (!user.success) {
      res.status(400).json({ message: user.message });
      return;
    }
    res.status(200).json({ message: "User wallet address updated", user: user });
  }




  if (method === "delete") {
    const { userToken } = req.body;
    const user = await deleteUser(userToken);
    if (!user.success) {
      res.status(400).json({ status: false, message: user.message });
      return;
    }
    let resUser = user.pasifUser;
    return res.status(200).json({ status: true, user: resUser });
  }



}
