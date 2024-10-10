// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import {
    makeWinDepositCoinByEmail,
} from "@/libs/models/user";
import { parse } from 'path';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

    // fetch
    // https://store.unove.space/api/storeSettlementHistory?store_code=2000001
    // {"result":1,"txid":"0x608e11cff599d269473e055258625e9d70d7093ee74b07dddc7ce3c07c4c9539","date":"2024-10-10 02:40:32","userid":"tiramisu@gmail.com","deposit":"999"}

    const result = await fetch('https://store.unove.space/api/storeSettlementHistory?store_code=2000001');
    
    if (!result.ok) {
        res.status(400).json({ message: 'Error' });
    }

    const data = await result.json();

    console.log(data);

    const { txid, date, userid, deposit } = data;

    // save to database
    /*
        const updatedUser = await makeDepositCoin(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
    */

    const email = userid;
    const amount = parseInt(deposit);

    const updatedUser = await makeWinDepositCoinByEmail(email, amount, txid);
    if (updatedUser.success) {
        return res.status(200).json({ message: "Success", updatedUser });
    }

    return res.status(400).json({ message: "Action Failed" });

}
