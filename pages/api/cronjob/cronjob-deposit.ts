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
    // {"result":1,"txid":"0x5c92b10f59b06aaf55f3f46a23ca6056de84dd1f321afc8732552d768d07103c","regist_date":"2024-10-10 01:39:31","member_id":"tiramisu@gmail.com","eth_php_finish":"858.006","eth_php_user":"1350"}

    const result = await fetch('https://store.unove.space/api/storeSettlementHistory?store_code=2000001');
    
    if (!result.ok) {
        res.status(400).json({ message: 'Error' });
    }

    const data = await result.json();

    console.log(data);

    const { txid, regist_date, member_id, eth_php_finish, eth_php_user } = data;

    // save to database
    /*
        const updatedUser = await makeDepositCoin(userToken, amount);
    if (updatedUser.success) {
      return res.status(200).json({ message: "Success", updatedUser });
    }
    return res.status(400).json({ message: "Action Failed" });
    */

    const amount = parseFloat(eth_php_finish);

    const updatedUser = await makeWinDepositCoinByEmail(member_id, amount, txid);
    if (updatedUser.success) {
        return res.status(200).json({ message: "Success", updatedUser });
    }

    return res.status(400).json({ message: "Action Failed" });

}
