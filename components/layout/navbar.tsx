'use client';
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import Image from 'next/image'
import API from '@/libs/enums/API_KEY';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Coin from '@/libs/enums/coin.enum';
import { IUser } from '@/libs/interface/user';
import MobilNavbar from './mobilNavbar';
import { useRouter } from 'next/navigation';

import { Button } from "@mui/material";
import { HelpCenter } from "@mui/icons-material";


import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


//@ts-ignore
import { io } from "socket.io-client";
import SocketEnum from '@/libs/enums/socket';

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";


import { useQRCode } from 'next-qrcode';
import { de } from 'date-fns/locale';

//import Modal from '../../components/Modal';

import Modal from '@/components/ModalPayment';






const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Navbar() {

    const router = useRouter();
    const [user, setUser] = useState<IUser>();

    const [craUsdt, setCraUsdt] = useState<any>();

    const [waiting, setWaiting] = useState<boolean>(true);

    const [status, setStatus] = useState<any>();

    const [socket, setSocket] = useState<any>();



    useEffect(() => socketInitializer(), []);

    const socketInitializer = () => {

      const socket = io(`${SocketEnum.id}`, {
          transports: ["websocket"],
      });

      setSocket(socket);

      socket.on("connect", () => {
          console.log("mobileNavbar connect");
      });

      socket.on('status', (data: any) => {
          console.log("mobileNavbar status", data);
          setStatus(true);
      });

      socket.on('time', (data: any) => {
          console.log("mobileNavbar time", data);
          //setTime(data)
      });

      socket.on('horse1Orana', (data: any) => {
          console.log("mobileNavbar horse1Orana", data);
          //setHorse1Oran(data)
      });

      socket.on('horse2Orana', (data: any) => {
          console.log("mobileNavbar horse2Orana", data);
          //setHorse2Oran(data)
      });
   
      
      socket.on('price', (data: any) => {
          //console.log(socket.id + " mobileNavbar price", data.price);
          
          //setCurrentPrice(data.price);

      });

      socket.on('prize', (data: any) => {
        console.log(socket.id + " mobileNavbar prize", data);
        

        //setErrMsg(data);
        //setErr(true);
        //❤️songpalabs❤️

        setSuccessMsg(data.username + ": ❤️" + data.amount + "❤️ CARROT");
        setSucc(true);

        //setCurrentPrice(data.price);


      });

      socket.on('winner', (data: any) => {
        console.log(socket.id + " navbar winner", data);
        
        //setCurrentPrice(data.price);
      });


      socket.on('cra_usdt', (data: any) => {
        ///console.log(socket.id + " cra_usdt price", data[0]?.ticker?.latest);

        setCraUsdt(data[0]?.ticker?.latest);
        


      });


    }


    useEffect(() => {

        return (() => {
          if (socket) {
            socket.disconnect();
          }
        });
  
    }, [socket]);



    const [succ, setSucc] = useState(false);
    const [err, setErr] = useState(false);
    const [successMsg, setSuccessMsg] = useState<String>("");
    const [errMsg, setErrMsg] = useState<String>("");

    const handleClickSucc = () => {

      setSuccessMsg("ok");
      setSucc(true);
    };

    const handleCloseSucc = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setSucc(false);
    };

    const handleClickErr = () => {

        setErrMsg("ok");
        setErr(true);
    };

    const handleCloseErr = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setErr(false);
    };




    const getUser = async () => {

        const inputs = {
            method: 'getOne',
            API_KEY: process.env.API_KEY,
            userToken: getCookie('user')
        }
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs)
        })
        const data = await res.json();

        //console.log("=====navbar getUser", data);

        setUser(data?.user?.user);

        setWaiting(false);
        
    }



    const [wallet, setWallet] = useState<any>(null);


    const [game, setGame] = useState<any>();




    const [showModalForDeposit, setShowModalForDeposit] = useState(false);





    useEffect(() => {
        if (hasCookie("user") && !user) {

            getUser()
            ////getGame()
            
            setInterval(() => {
                getUser()
                ///getGame()
            }, 10 * 1000)
            
        }
    })
    



    
    useEffect(() => {

        const getGame = async () => {

            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                body: JSON.stringify({
                    method: "getGameByUsername",
                    API_KEY: process.env.API_KEY,
                    username: user?.username,
                })
            })
            const data = await res.json()
    
            ////console.log("=====navbar getGame", data);

            setGame(data.game)

        }

        if (hasCookie("user") && user?.username) {
            getGame();
        }

        setInterval(() => {
            if (hasCookie("user") && user?.username) {
                getGame();
            }
        }, 10 * 1000)
        

    },[status, user?.username]);
    


    useEffect(() => {
        setWallet(user?.nftWalletAddress);
    }, [user?.nftWalletAddress]);



    const [cryptoPayWalletAddress, setCryptoPayWalletAddress] = useState<any>('');

    const [depositAddress, setDepositAddress] = useState<any>('');


    useEffect(() => {

        setDepositAddress(cryptoPayWalletAddress);

    } , [cryptoPayWalletAddress]);



    useEffect(() => {

        const getCryptoPayWalletAddress = async () => {

            try {


                const res = await fetch("/api/deposit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      method: "getCryptopayWalletAddress",
                      API_KEY: process.env.API_KEY,
                      userToken: getCookie("user"),
                      userid: user?.email,
                    }),
                });

                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                  

                const data = await res.json()

                console.log("=====navbar getCryptoPayWalletAddress", data);

                setCryptoPayWalletAddress(data.walletAddress);

            } catch (error) {
                console.log("=====navbar getCryptoPayWalletAddress error", error);
            }

        }

        if (user?.email) {
            getCryptoPayWalletAddress();
        }

    }, [user?.email]);




    /////console.log("cryptoPayWalletAddress==============", cryptoPayWalletAddress);



    const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
    const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");
  

    const { Canvas } = useQRCode();



    // acceptOrder
    // open popup modal window for selecting krwAmount 10000, 20000, 50000, 100000, 200000, 500000
    // and input mobile number
    // if select krwAmount and input mobile number, then open popup window for payment

    const [showModal, setShowModal] = useState(false);

    const [krwAmount, setKrwAmount] = useState(0);

    const [isKrwAmount10000, setIsKrwAmount10000] = useState(false);
    const [isKrwAmount20000, setIsKrwAmount20000] = useState(false);
    const [isKrwAmount30000, setIsKrwAmount30000] = useState(false);
    const [isKrwAmount40000, setIsKrwAmount40000] = useState(false);
    const [isKrwAmount50000, setIsKrwAmount50000] = useState(false);


    const [localMobileNumber, setLocalMobileNumber] = useState("");

  

       /*
    curl -X POST https://next.unove.space/api/order/getAllSellOrdersForBuyer -H "Content-Type: application/json" -d '{"walletAddress": "0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345", "searchMyTrades": true}'
    */


    const acceptOrder = async () => {

        /*
                
            const buyerWalletAddress = "0x630a9a06d94B2Bae290211B3a2c2a4FA1FdDd002";
    const buyerNickname = "spiderman";
    const buyerAvatar = "https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/I5GmPhb-8QVXB7uzmyglxQPyVF2DLgYVLXwUOy.jpeg";
    const buyerMobile = smsMobileNumber;


    try {
      const response2 = await fetch("https://next.unove.space/api/order/acceptSellOrder", {
      */

        // get orders
        const response = await fetch("https://next.unove.space/api/order/getAllSellOrdersForBuyer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            //body: JSON.stringify({ walletAddress: "0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345", searchMyTrades: true }),
            body: JSON.stringify({ walletAddress: "", searchMyTrades: false }),
        });

        const data = await response.json();

        if (!data) {
        
            setErrMsgSnackbar("acceptOrder request failed");
            setErr(true);

            alert("acceptOrder request failed");

            return;
        
        }
  
        const orders = data.result.orders;

        console.log("getAllSellOrdersForBuyer", orders);

        if (orders.length === 0) {
            setErrMsgSnackbar("No orders");
            setErr(true);

            alert("No orders");
            return;
        }

        const order = orders.find((order : any) => order.krwAmount === krwAmount && order.status === "ordered");

  
        console.log("order", order);
    
    
    
        if (!order) {
            setErrMsgSnackbar("No order");
            setErr(true);

            alert("No order");
            return;
        }
    

        /*

    const buyerWalletAddress = "0x630a9a06d94B2Bae290211B3a2c2a4FA1FdDd002";
    const buyerNickname = "spiderman";
    const buyerAvatar = "https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/I5GmPhb-8QVXB7uzmyglxQPyVF2DLgYVLXwUOy.jpeg";
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
          buyerMobile: buyerMobile,
          buyerMemo: storeCode + ":" + storeUserId,
        }),

      });

      const data2 = await response2.json();
      */





    }


    const getOrders = async () => {






        
        const res = await fetch('/api/depositRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "acceptOrder",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("user"),
                krwAmount: krwAmount,
                smsMobileNumber: '+82' + localMobileNumber,
                storeCode: 2000001,
                storeUserId: user?.email,
            }),
        })
        const data = await res.json();

        console.log("acceptOrder", data);




        /*
        {
    "_id": "66aa0ee127e684b0d476c154",
    "walletAddress": "0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345",
    "nickname": "bello",
    "mobile": "+8201053481647",
    "avatar": "https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/bKsv0xx-i5gCYHsETPQ9VsOLzkQGV5bzVS39o5.png",
    "seller": {
        "status": "confirmed",
        "bankInfo": {
            "bankName": "카카오뱅크",
            "accountNumber": "234242234",
            "accountHolder": "김범수"
        }
    },
    "usdtAmount": 7.1279,
    "krwAmount": 10000,
    "rate": 1403,
    "createdAt": "2024-07-31T10:16:01.053Z",
    "status": "accepted",
    "privateSale": false,
    "acceptedAt": "2024-07-31T11:01:31.555Z",
    "buyer": {
        "walletAddress": "0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345",
        "nickname": "vienna",
        "avatar": "https://vzrcy5vcsuuocnf3.public.blob.vercel-storage.com/3Ntag4p-fQst7JyMl3CbrwFYT3ouLYeeqjLJw6.jpeg",
        "mobile": "+8201098551647"
    },
    "tradeId": "415237"
}
        */

        if (data.status === false) {
            setErrMsgSnackbar(data.message);
            setErr(true);
        } else {

            const orderId = data.order._id;

            const url = "https://next.unove.space/kr/pay-usdt/" + orderId;

            console.log("url", url);

            window.open(
                url,
                '_blank',
                'top=10, left=10, width=420, height=900, status=no, menubar=no, toolbar=no, resizable=no'
            )

            /*
            window.open(
                'https://corky.vercel.app/payment?storecode=2000001&memberid='+user?.email,
                '_blank',
                'top=10, left=10, width=420, height=900, status=no, menubar=no, toolbar=no, resizable=no'
                )
            */

        }





        ///console.log("deposits=>", data.deposits, "user=>", getCookie("user")  );

        ///setRequests(data.deposits)
    }




 

    const getOrders2 = async () => {

        const sellerWalletAddress = '0x06F453c78592bC1c8A18A4B0bB06d10eE9D90345';
            
        try {

            const res = await fetch("https://next.unove.space/api/order/getAllSellOrdersForBuyer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walletAddress: sellerWalletAddress,
                    searchMyTrades: true,
                }),
            })

            const data = await res.json();

            console.log("getAllSellOrdersForBuyer", data);

            window.open(
                'https://corky.vercel.app/payment?storecode=2000001&memberid='+user?.email,
                '_blank',
                'top=10, left=10, width=420, height=900, status=no, menubar=no, toolbar=no, resizable=no'
                )

        } catch (error) {
            console.error("Error:", error);
        }

    } 


    const [agreement, setAgreement] = useState(false);


    return (
        <>
            {/* //? LG Screen üstü görüntü */}
            <div className="hidden items-center justify-center w-full h-20 bg-[#000000] sticky top-0 z-50 
                lg:flex
                ">

                <div className="flex w-[800px] items-center justify-center p-5">


                <div className="flex flex-col pt-2 gap-3 items-center justify-center w-[200px] absolute bg-[#000000] rounded-lg h-full z-50 
                     
                     ">
                    <Link href={"/"} className="hover:opacity-50">
                        <Image src={"/ci.png"} alt="" width={20} height={20} />
                    </Link>

                    {/*
                    <div className=" font-normal text-xs text-gray-200 tracking-widest">Change Your Life</div>
                    */}

                    
                    <div className="flex w-[250px] items-center justify-center text-white text-base font-bold">
                        VIENNA
                    </div>
            
                </div>


                <div className="flex flex-col items-center justify-center w-full h-full ">


                    <div className="flex items-center justify-center w-full h-full bg-[#000000] px-3 ">
                        
                        <button className="hover:opacity-50">


                        {user && game?.selectedSide === "Long" &&
                            <Image
                            src={'/rabbit1.gif'}
                            width={35}
                            height={35}
                            alt="game"
                            className="rounded-md"
                            onClick={() => {
                                router.push('/gameT2E')
                            }}
                            />
                        }

                        {user && game?.selectedSide === "Short" &&
                            <Image
                            src={'/rabbit2.gif'}
                            width={35}
                            height={35}
                            alt="game"
                            className="rounded-md"
                            onClick={() => {
                                router.push('/gameT2E')
                            }}
                            />
                        }

                        {user && !game &&
                            <Image
                            src={user?.img}
                            width={30}
                            height={30}
                            alt="pfp"
                            className="rounded-md"
                            onClick={() => {
                                router.push('/gameT2E')
                            }}
                            />
                        }

                        </button>



                        <div className="flex items-center w-full justify-end gap-4">

                            {
                            user && <div
                                className={`flex flex-row items-center justify-center  bg-black rounded-md h-[36px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] `}
                            >


                            {/*
                                user && <button
                                    className={`flex items-center shadow-xl  justify-center rounded-md  gap-2  h-[36px] px-2 text-[#D4D1CB] text-l`}
                                    ///onClick={() => setShowModal(!showModal)}


                                    onClick={() => (

                                        ///console.log("user?.walletAddress", user?.walletAddress),

                                     
                                        setShowModal(true)
       

                                    )}
                                    


                                >

                                    <Image src={"/wallet-icon-white.png"} width={20} height={20} alt="logo" />
                                    

                                </button>
                            */} 
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                        // http://store.unove.space/Store/depositpopup?storecode=2000001&memberid=test001
                                        // modal window for deposit

                                        
                                        //window.open("http://store.unove.space/Store/depositpopup?storecode=2000001&memberid="+user?.email, "popup", "width=600,height=600");


                                        // https://next.unove.space/kr/polygon/pay-usdt/0

                                        //window.open("https://next.unove.space/kr/polygon/pay-usdt/0", "popup", "width=600,height=600");

                                        ///kr/polygon/pay-usdt/0?storeUser=ironman@2000001

                                        window.open("https://next.unove.space/kr/polygon/pay-usdt/0?storeUser="+user?.email+"@2000001", "popup", "width=500,height=950");

                                        
                                    }}
                                >
                                    <Image src={"/wallet-icon-white.png"} width={20} height={20} alt="logo" />
                                </Button>



                                {/*
                                <Link
                                    className="pr-5 hover:opacity-50"
                                    href={

                                        "/myPage/deposit"
                                    
                                    }
                                >
                                    <Image src={"/wallet-icon-white.png"} width={20} height={20} alt="logo" />
                                </Link>
                                */}
                                

                                {/*
                                // 
                                        // http://store.unove.space/Store/depositpopup?storecode=2000001&memberid=test001
                                        // popup window for deposit
                                        
                                */}

                                {/*
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                        // http://store.unove.space/Store/depositpopup?storecode=2000001&memberid=test001
                                        // modal window for deposit

                                        
                                        //window.open("http://store.unove.space/Store/depositpopup?storecode=2000001&memberid="+user?.email, "popup", "width=600,height=600");

                                  


                                        //setShowModalForDeposit(true);

                                        
                                    }}
                                >
                                    <Image src={"/wallet-icon-white.png"} width={20} height={20} alt="logo" />
                                </Button>
                                */}

                          
                                

                                


                                <div className="flex flex-row items-center justify-center gap-1 text-sm xl:text-lg">
                                    {Number(user?.deposit).toFixed(0)}
                                </div>
                                
                                
                                <span className="ml-2 text-red-500 text-xs xl:text-xs">{" "}CRT</span>
                                

                            </div>
                            }

                            {    
                                !user && <Link
                                    href={"/myPage/login"}
                                    className={`text-[13px] text-[#9293A6]  border-t-2 border-green-500 p-1`}
                                >
                                    Login
                                </Link>
                            }

                            {/*
                                waiting && <div
                                    className="flex flex-row items-center justify-center  bg-black rounded-md h-[36px] text-center px-2 text-[#BA8E09] border border-[#BA8E09] ">
                                    Loading Your Profile...
                                    </div>

                        */}


                           {/* logout */}
                           {user && (
                            <div className="flex flex-col items-center justify-center gap-1">
                            <Button 
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                        deleteCookie('user');
                                        getUser();
                                        router.push('/');
                                    }}
                                >
                                    Logout
                                </Button>

                                <Button 
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                        router.push('/myPage/withdrawRequests');
                                    }}
                                >
                                    Withdraw
                                </Button>


                            </div>
                            )}



                        </div>
                    </div>
                </div>


                </div>

            </div>


            {/* Modal for selecting krwAmount and input mobile number

                // open popup modal window for selecting krwAmount 10000, 20000, 50000, 100000, 200000, 500000
                // and input mobile number
                // if select krwAmount and input mobile number, then open popup window for payment
            
            */}

        
            <Modal
                
                show={showModal}
                onClose={() => setShowModal(false)} 

            >

                <div className=" pt-28 pr-20 w-full h-[800px] bg-gray-900 rounded-lg">

                    <div className="flex flex-col items-center justify-center gap-3">

                        <div className="text-white text-lg font-bold">Select Amount</div>

                        <div className="grid grid-cols-3 gap-3">

                            <button
                                className="flex items-center justify-center rounded-md bg-[#BA8E09] text-white text-lg font-bold h-[50px] w-[100px]"
                                onClick={() => setKrwAmount(10000)}
                            >
                                10,000
                            </button>

                            <button
                                className="flex items-center justify-center rounded-md bg-[#BA8E09] text-white text-lg font-bold h-[50px] w-[100px]"
                                onClick={() => setKrwAmount(20000)}
                            >
                                20,000
                            </button>

                            <button
                                className="flex items-center justify-center rounded-md bg-[#BA8E09] text-white text-lg font-bold h-[50px] w-[100px]"
                                onClick={() => setKrwAmount(30000)}
                            >
                                30,000
                            </button>

                            <button
                                className="flex items-center justify-center rounded-md bg-[#BA8E09] text-white text-lg font-bold h-[50px] w-[100px]"
                                onClick={() => setKrwAmount(40000)}
                            >
                                40,000
                            </button>

                            <button
                                className="flex items-center justify-center rounded-md bg-[#BA8E09] text-white text-lg font-bold h-[50px] w-[100px]"
                                onClick={() => setKrwAmount(50000)}
                            >
                                50,000
                            </button>


                        </div>
                        {/* selected krwAmount */}
                        <div className="mt-10 text-white text-xl font-bold">Selected Amount: {krwAmount}</div>

                        <div className="mt-5 text-white text-lg font-bold">Input Mobile Number</div>

                        <div className='flex flex-row items-center justify-center gap-3'>

                            <span
                                className="text-white text-lg font-bold"
                            >+82</span>

                            <input
                                type="number"
                                className="w-[250px] h-[50px] rounded-md bg-black text-white text-lg font-bold"
                                placeholder="Mobile Number"
                                value={localMobileNumber}
                                onChange={(e) => (
                                    
                                    setLocalMobileNumber(e.target.value)
                                    // prefix +82

                                    //setMobileNumber("+82" + e.target.value)

                                )}
                            />


                        
                        </div>

                        <div className='ml-10 flex flex-col items-center justify-center gap-3'>

                            <div className='flex flex-row items-center justify-center gap-3'>
                                {/* dot */}
                                <span className="text-white text-lg font-bold">•</span>
                                <span className="text-white text-sm font-bold">
                                    주의사항: 구매한 USDT는 다음 지갑주소로 입금되며, 입금완료 후 10분 이내에 포인트로 전환됩니다.
                                </span>
                            </div>
                            <span className="text-white text-sm font-bold">
                                0x630a9a06d94B2Bae290211B3a2c2a4FA1FdDd002
                            </span>
                            <div className="flex flex-row items-center justify-center gap-3">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6"
                                    checked={agreement}
                                    onChange={(e) => setAgreement(e.target.checked)}
                                />
                                <span className="text-white text-lg font-bold">
                                    동의합니다.
                                </span>
                            </div>

                        </div>



                        <div className="mt-5 flex flex-row items-center justify-center gap-3">

                            <button
                                disabled={krwAmount === 0 || localMobileNumber === "" || !agreement}
                                className={`flex items-center justify-center rounded-md bg-[#BA8E09] text-white text-lg font-bold h-[50px] w-[100px]
                                    ${krwAmount === 0 || localMobileNumber === "" || !agreement ? "opacity-50" : ""}`}
                                onClick={() => {
                                    setShowModal(false);
                                    
                                    ///getOrders();

                                    acceptOrder();

                                }}
                            >
                                OK
                            </button>

                            <button
                                className="flex items-center justify-center rounded-md bg-[#BA8E09] text-white text-lg font-bold h-[50px] w-[100px]"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>


            </Modal>



            {/*
            <Modal
              
              show={showModal}
              onClose={() => setShowModal(false)}
                
            >

            <div className="w-full flex flex-row items-center justify-left gap-1 bg-red-900 ">

              {wallet !== "0x" && 

                  <button
                    className="w-full text-white text-center justify-left pl-3 p-2 items-left bg-red-900 hover:bg-[#141111] flex flex-row"
                    onClick={() => {
                      setShowModal(false), router.push('/myPage/mynft')
                  }}
                  >
                      <Image
                        src={"/metamask-fox.svg"}
                        alt="meta-svg"
                        width={20}
                        height={20}
                      />
                    <h2 className="pl-3 text-left text-xs">
                          <span className="text-[#f5841f]">Connected with</span>
                          <p className="text-sm text-white">{wallet?.slice(0, 5)}...{wallet?.slice(wallet.length - 5, wallet?.length)}</p>
                    </h2>

                  </button>
              }
              {wallet === "0x" && 
          
                    <button
                      className="w-full text-white text-center justify-center p-5 items-center bg-red-900 hover:bg-[#141111] flex flex-row"
                      onClick={() => {
                        setShowModal(false), router.push('/myPage/mynft')
                      }}
                      >
                        <Image
                            src={"/metamask-fox.svg"}
                            alt="meta-svg"
                            width={20}
                            height={20}
                        />
                        <h2 className="text-sm pl-3">
                            <span className="text-[#f5841f]">METAMASK</span> CONNECT
                        </h2>
                    </button>
           
              }

            </div>


            <div className='flex flex-col pl-5 pr-3 mt-3 text-gray-200 '>


              <div className="w-full rounded-lg flex flex-col items-center justify-center pt-2 gap-1">                                    
                  
                  <div className="w-full rounded-lg flex flex-row items-center justify-left  gap-1 ">

                    {user && <Image
                        src={user?.img}
                        width={90}
                        height={90}
                        alt="pfp"
                        className="rounded-md"
                    />}

                    <div className="w-full rounded-lg flex flex-col items-center justify-left p-2 gap-1 ">
                      <div className='text-xs'>Equity Value (CARROT)</div>

                      <div className='text-xl font-extrabold'>
                        {`${Number(user?.deposit).toFixed(0)}`}
                      </div>

                      <div className='text-sm font-extrabold'>

                      =&nbsp;{ user?.deposit ? `${Number(user?.deposit * craUsdt).toFixed(0)}` : `0`}&nbsp;&nbsp;<span className="text-[8px] text-green-500">USDT</span>
                      
                      </div>

                      {user &&
                      <button
                          className={`text-[12px] text-red-500`}
                          onClick={() => {
                            setShowModal(false);
                            deleteCookie('user');
                            getUser();
                            router.push('/myPage');
                          }}
                      >
                          Log Out
                      </button>
                      }
                    </div>
                                                        
                  </div>


                  <div
                    className={` w-full pt-3 items-left text-base text-white`}
                    onClick={() => {
                        setShowModal(false), router.push('/myPage/depositRequests')
                    }}
                    >
                    Deposit
                  </div>

                  <div
                    className={`w-full pt-1 items-left text-base text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/myPage/withdrawRequests')
                    }}
                    >
                      Withdrawal
                  </div>

                  <div
                    className={`w-full pt-1 items-left text-base text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/myPage/betHistory')
                    }}
                    >
                      Bet History
                  </div>

                  <div
                    className={` disabled pt-1 w-full items-left text-base text-[#A9A9A9]  `}
                    onClick={() => {
                        setShowModal(false), router.push('/')
                    }}
                    >
                      Game Ranking
                  </div>

                  <div
                    className={` pt-5 w-full items-left text-base text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E/help')
                    }}
                    >
                      How to Bet in T2E Game?<br></br>

                      <Button variant="contained" color="primary" startIcon={<HelpCenter />}>
                        Click Here
                      </Button>

                  </div>

              </div>

            </div>

            </Modal>
            */}

            

            {/*}
            <Modal
              
              show={showModal}
              onClose={() => setShowModal(false)}
                
            >

            <div className="  w-full flex flex-row items-center justify-left gap-1  rounded-lg ">

         
                <div
                    className="w-full text-white text-center justify-center p-2 items-left bg-red-900 flex flex-row rounded-t-lg"
                >
                    <Image
                        className='rounded-md'
                        src={"/cryptopay-logo.png"}
                        alt="meta-svg"
                        width={30}
                        height={30}
                    />
                    <h2 className="pl-3 text-left text-xs xl:text-lg">
                          <span className="text-white">CryptoPay</span>
                    </h2>

                  </div>
              

                </div>


                <div className='flex flex-col pl-5 pr-3 mt-3 text-gray-200 '>





                <div className="w-full rounded-lg flex flex-col items-center justify-center pt-2 gap-1">                                    



                <div className="w-full rounded-lg flex flex-col items-center justify-start  gap-1 ">

                  <div className="w-full rounded-lg flex flex-col items-center justify-start p-2 gap-2">

                    <div className='text-sm xl:text-lg'>Deposit Address</div>



                    <div className='flex flex-row items-center justify-center centent-center gap-2'>
                        <div className='text-xs font-extrabold'>Select Network</div>
                        <div className='flex flex-col items-center justify-center centent-center gap-1'>
                            <div className='flex flex-row items-center justify-center centent-center gap-1'>
                                
                                <div className=' w-24 text-lg font-extrabold'>Polygon</div>

                                <input type="radio" name="network" value="polygon"
                                    defaultChecked
                                    onClick={() => {
                                        setDepositAddress(cryptoPayWalletAddress);
                                    } }
                                />
                            </div>

                            <div className='flex flex-row items-center justify-center centent-center gap-1'>
                                <div className=' w-24 text-lg font-extrabold'>Ethereum</div>
                                <input type="radio" name="network" value="ethereum"
                                    
                                        onClick={() => {
                                            setDepositAddress(cryptoPayWalletAddress);
                                        } }
                                />
                            </div>


                            <div className='flex flex-row items-center justify-center centent-center gap-1'>
                                <div className=' w-24 text-lg font-extrabold'>Tron</div>
                                <input type="radio" name="network" value="tron"

                                    onClick={() => {
                                        //setCryptoPayWalletAddress("TPS4RXio6YXng6Xu7WLdZbdU3piAJE4FvF");

                                        setDepositAddress("TPS4RXio6YXng6Xu7WLdZbdU3piAJE4FvF");

                                    } }
                                />
                            </div>


                        </div>
                    </div>


                    <div className='mt-10 text-sm font-extrabold'>
                      
                      {depositAddress}

                    </div>

                    <>
                        <div className='mt-2 w-full flex flex-row items-center justify-center centent-center'>

         

                            <Button
                            color="success" variant='contained' className='bg-green-500'
                            onClick={() =>
                                {
                                navigator.clipboard.writeText(cryptoPayWalletAddress);
                                setSucc(true);
                                setSuccessMsgSnackbar("Your wallet address copied to clipboard");
                                }
                            }
                        >
                            Copy
                        </Button>

                        

                        </div>

                        <div className='mt-10 w-full flex flex-row items-center justify-center centent-center'>
                            <Canvas
                            text={cryptoPayWalletAddress}
                            options={{
                            ////level: 'M',
                            margin: 3,
                            scale: 4,
                            width: 200,
                            color: {
                                dark: '#010599FF',
                                light: '#FFBF60FF',
                            },
                            }}
                            />
                        </div>
                    </>

                  </div>

                    <div className="w-full rounded-lg flex flex-col items-center justify-left p-2 gap-1 ">
  
                        <div className='text-lg xl:text-xl font-bold'>1 USDT = 1,392 CARROT</div>

                        


                    </div>


                </div>

    

              </div>


              <button
                    className={` w-full mt-5 pt-3 items-left text-base text-white hover:bg-[#141111] border-t-2 border-green-500 p-1`}
                      
                        
                    onClick={() => {
                        setShowModal(false), router.push('/myPage/withdrawRequests')
                    }}
                >
                    Withdrawal Requests
                </button>



            </div>

            </Modal>

            */}














            <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={succ}
          autoHideDuration={6000}
          onClose={handleCloseSucc}
        >
          <Alert
            onClose={handleCloseSucc}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMsgSnackbar}
          </Alert>
        </Snackbar>
        <Snackbar open={err} autoHideDuration={6000} onClose={handleCloseErr}>
          <Alert
            onClose={handleCloseErr}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errMsgSnackbar}
          </Alert>
        </Snackbar>
      </Stack>



{/*
            <Stack spacing={2} sx={{ width: "100%" }}>

              <Snackbar
                  open={succ}
                  autoHideDuration={6000}
                  onClose={handleCloseSucc}
              >
                  <Alert
                      onClose={handleCloseSucc}
                      severity="info"
                      sx={{ width: "100%" }}
                  >
                      {successMsg}
                  </Alert>
              </Snackbar>

              <Snackbar open={err} autoHideDuration={6000} onClose={handleCloseErr}>
                  <Alert
                      onClose={handleCloseErr}
                      severity="error"
                      sx={{ width: "100%" }}
                  >
                      {errMsg}
                  </Alert>
              </Snackbar>
            </Stack>  
*/}  









            {/* //? Mobil Navbar */}

        
            
            <MobilNavbar user={user} game={game} />
                      





            <Modal
              
              show={showModalForDeposit}
              onClose={() => setShowModalForDeposit(false)}
                
            >




            <div className=" w-64 h-96 bg-[#000000]">



                {/*
                // http://store.unove.space/Store/depositpopup?storecode=2000001&memberid=test001
                // iframe for deposit
                */}

                <iframe
                    src="http://store.unove.space/Store/depositpopup?storecode=2000001&memberid=test001"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    title="deposit"
                ></iframe>


            </div>


            </Modal>



        </>
    )
}


