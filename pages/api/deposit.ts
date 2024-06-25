import {
  makeDepositCoin,
  makeDepositMatic,
  makeWinDepositCoin,
  swapToMatic,
} from "@/libs/models/user";

import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;

  if (API_KEY !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (method === "makeMaticDeposit") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await makeDepositMatic(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "swapToCoin") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await makeDepositCoin(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "winDeposit") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await makeWinDepositCoin(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "swapToMatic") {
    const { userToken, amount } = req.body;
    if (!userToken || !amount) {
      res.status(400).json({ message: "Bad Request" });
      return;
    }
    const updatedUser = await swapToMatic(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
  }

  if (method === "getCryptopayWalletAddress") {
    const { userToken, userid } = req.body;


    //console.log("getCryptopayWalletAddress", userToken, userid);



    if (!userToken || !userid || userid === "") {
      res.status(400).json({ message: "Bad Request" });
      return;
    }


  
    // api call
    // https://corky.vercel.app/api/cryptopay/user/create?userid=abcd1001@gmail.com


    //const data = await fetch(`https://corky.vercel.app/api/cryptopay/user/create?userid=${userid}`, {

    // http://store.unove.space/Api/walletAddress?storecode=10001&memberid=creath.park@gmail.com

    const data = await fetch(`http://store.unove.space/Api/walletAddress?storecode=2000001&memberid=${userid}`, {

      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await data.json();
    console.log(response);

    if (response?.result === 1) {
      return res.status(200).json({ message: "Success", walletAddress: response?.data });
    }

    return res.status(400).json({ message: "Action Failed", walletAddress: '' });

  }





}
