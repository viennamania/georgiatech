import {
  newDepositRequest,
  getDepositRequest,
  getAllDepositRequests,
  getAllDepositRequestsforUser,
  updateDepositRequest,
  deleteDepositRequest,
} from "@/libs/models/depositRequest";
import { User } from "@/libs/models/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, API_KEY } = req.body;

  if (API_KEY !== process.env.API_KEY) {
    return res.status(200).json({
      status: false,
      message: "API Key is not valid",
    });
  }

  if (method === "new") {
    const { userToken, email1, withdrawAmount, walletTo, type } = req.body;

    if (!userToken || !email1 || !withdrawAmount || !walletTo || !type) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ userToken: userToken });

    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }

    if (type === "Matic" && user.maticBalance < withdrawAmount) {
      return res.status(200).json({
        status: false,
        message: "Not enough Matic",
      });
    }

    if (type === "Coin" && user.deposit < withdrawAmount) {
      return res.status(200).json({
        status: false,
        message: "Not enough Coin",
      });
    }

    const newDeposit = await newDepositRequest(
      userToken,
      email1,
      withdrawAmount,
      walletTo,
      type
    );
    if (!newDeposit) {
      return res.status(200).json({
        status: false,
        message: "Deposit request failed",
      });
    }

    if (newDeposit.status === false) {
      return res.status(200).json({
        status: false,
        message: "Request Already Exists",
      });
    }

    if (type === "Matic") {
      user.maticBalance = user.maticBalance - withdrawAmount;
    }

    if (type === "Coin") {
      user.deposit = user.deposit - withdrawAmount;
    }

    const updatedUser = await user.save();
    if (!updatedUser) {
      return res.status(200).json({
        status: false,
        message: "Deposit request failed",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Deposit request successful",
      newDeposit,
    });
  }

  if (method === "getOne") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await getDepositRequest(_id);
    if (!deposit) {
      return res.status(200).json({
        status: false,
        message: "Deposit request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Deposit request successful",
      deposit,
    });
  }

  if (method === "getAll") {
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposits = await getAllDepositRequests();
    if (!deposits) {
      return res.status(200).json({
        status: false,
        message: "Deposits request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Deposits request successful",
      deposits,
    });
  }


  if (method === "getAllforUser") {
    const { userToken } = req.body;
    if (!userToken) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ userToken: userToken });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const deposits = await getAllDepositRequestsforUser(user.email);
    if (!deposits) {
      return res.status(200).json({
        status: false,
        message: "Deposits request failed",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Deposits request successful",
      deposits,
    });
  }  


  if (method === "update") {
    const { _id, txHash, status, gonderildi } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await updateDepositRequest(_id, status, txHash, gonderildi);
    if (!deposit) {
      return res
        .status(200)
        .json({ status: false, message: "Deposit update failed" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Deposit update successful", deposit });
  }

  if (method === "reject") {
    const { _id, userToken, txHash, status, gonderildi } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await updateDepositRequest(_id, status, txHash, gonderildi);
    if (!deposit) {
      return res
        .status(200)
        .json({ status: false, message: "Deposit update failed" });
    }
    const user = await User.findOne({ userToken: userToken });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }
    if (deposit.type === "Matic") {
      user.maticBalance = user.maticBalance + deposit.withdrawAmount;
      user.save();
    }
    if (deposit.type === "Coin") {
      user.deposit = user.deposit + deposit.withdrawAmount;
      user.save();
    }
    return res
      .status(200)
      .json({ status: true, message: "Deposit update successful", deposit });
  }

  if (method === "delete") {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const deposit = await deleteDepositRequest(_id);
    if (!deposit) {
      return res
        .status(200)
        .json({ status: false, message: "Deposit delete failed" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Deposit delete successful", deposit });
  }









  if (method === "acceptOrder") {

  
    
    //krwAmount: krwAmount,
    //smsMobileNumber: localMobileNumber,

    const {krwAmount, smsMobileNumber } = req.body;


    ///const deposit = await getDepositRequest(_id);

    //   curl -X POST https://next.unove.space/api/order/getAllSellOrdersForBuyer -H "Content-Type: application/json" -d '{"walletAddress": "0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345", "searchMyTrades": true}'
  
    const response = await fetch("https://next.unove.space/api/order/getAllSellOrdersForBuyer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //body: JSON.stringify({ walletAddress: "0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345", searchMyTrades: true }),
      body: JSON.stringify({ walletAddress: "", searchMyTrades: false }),
    });

    const data = await response.json();

    ///console.log(data);

 


    if (!data) {
      return res.status(200).json({
        status: false,
        message: "acceptOrder request failed",
      });
    }

    const orders = data.result.orders;

    /*
 
    */

    //console.log(orders);

    if (!orders) {
      return res.status(200).json({
        status: false,
        message: "acceptOrder request failed",
      });
    }

    // find one krwAmount is 10000 and status is open

    //const order = orders.find((order : any) => order.krwAmount === krwAmount);

    const order = orders.find((order : any) => order.krwAmount === krwAmount && order.status === "ordered");

  
    //console.log(order);



    if (!order) {
      return res.status(200).json({
        status: false,
        message: "acceptOrder request failed",
      });
    }

    ///console.log(order);


    // accept order
    /*
    curl -X POST https://your-api-url/api/order/acceptSellOrder \
     -H "Content-Type: application/json" \
     -d '{
           "orderId": "yourOrderId",
           "buyerWalletAddress": "yourWalletAddress",
           "buyerNickname": "yourNickname",
           "buyerAvatar": "yourAvatar",
           "buyerMobile": "yourSmsNumber"
         }'

    */

    const buyerWalletAddress = "0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345";
    const buyerNickname = "vienna";
    const buyerAvatar = "https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/3Ntag4p-fQst7JyMl3CbrwFYT3ouLYeeqjLJw6.jpeg";

    const buyerMobile = smsMobileNumber;


    try {
      const response2 = await fetch("https://next.unove.space/api/order/acceptSellOrder", {
        method: "POST",
        headers: {

          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          orderId: order._id,
          buyerWalletAddress: buyerWalletAddress,
          buyerNickname: buyerNickname,
          buyerAvatar: buyerAvatar,
          buyerMobile: buyerMobile
        }),

      });

      const data2 = await response2.json();

      console.log(data2);



      return res.status(200).json({
        status: true,
        message: "acceptOrder request successful",
        order: order,
      });


    } catch (error) {

      return res.status(200).json({
        status: false,
        message: "acceptOrder request failed",
      });

      console.log("error", error);
    }

  }




  return res.status(400).json({ message: "Missing required fields" });
}
