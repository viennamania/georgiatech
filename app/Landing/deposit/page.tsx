"use client";
import { getCookie, hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Web3 from "web3";
import abi from "@/public/abi.json";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Stack, Snackbar, Alert } from "@mui/material";

import Coin from "@/libs/enums/coin.enum";
import API from "@/libs/enums/API_KEY";
import { IUser } from "@/libs/interface/user";
import DomainEnum from "@/libs/enums/domain";
import Link from 'next/link';

import { useQRCode } from 'next-qrcode';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';



import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import axios from 'axios';

import dynamic from "next/dynamic";

const CC = dynamic(() => import("@/components/copy-clipboard").then(mod => mod.CopyClipboard), { ssr: false })




export default function Deposit() {
  let Abifile: any = abi;
  let contractAddress = "0x46aA314E5ee3c0E5E945B238075d2B5eB2AAA317";

  const MySwal = withReactContent(Swal);

  const [errMsg, setErrMsg] = useState<String>();
  const [metamusk, setMetaMask] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>(null);
  const [networkName, setNetworkName] = useState<any>(null);
  const [network, setNetwork] = useState<any>(false);
  const [contract, setContract] = useState<any>();
  const [depositCount, setDepositCount] = useState<any>(0);
  const [metamaskview, setMetamaskView] = useState<boolean>(false);
  const router = useRouter();

  const [succ, setSucc] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
  const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");

  const [waiting, setWaiting] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const [settings, setSettings] = useState<any>();
  
  const [mobileNumber, setMobileNumber] = useState<any>(null);
  const [authCodeState, setAuthCodeState] = React.useState(false);
  const [authCode, setAuthCode] = useState<any>(null);


  const [input, setInput] = useState(null);
	const [response, setResponse] = useState(null);


  const { Canvas } = useQRCode();


  const getUser = async () => {
    const inputs = {
      method: 'getOne',
      API_KEY: API.key,
      userToken: getCookie('user')
    }
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })
    const user = await res.json()
    setUser(user.user.user)
  }
  
  const getSettings = async () => {
    const res = await fetch(DomainEnum.address + '/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "get",
        API_KEY: process.env.API_KEY,
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    if (data.status === false) {
      return
    } else {
      setSettings(data.settings[0]);
    }
  }


  useEffect(() => {
    getUser();
    getSettings();
  }, [])

  /*
  useEffect(() => {
    setMetaMask(isMetaMaskInstalled());
    checkAccount();
    const { ethereum }: any = window;
    if (metamusk == true) {
      ethereum.on("networkChanged", function (networkId: any) {
        if (networkId == 97) {
          setNetwork(true);
        } else {
          setNetwork(false);
        }
      });

      ethereum.on("accountsChanged", function (accounts: any) {
        if (accounts.length !== 0) {
          setWallet(accounts[0]);
        } else {
          setWallet(null);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */


  //? METAMASK
  const isMetaMaskInstalled = () => {
    const { ethereum }: any = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };


  
  const connectWallet = async () => {
    try {
      const { ethereum }: any = window;
      if (!ethereum) {
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });

      ////const ethChainId = "0x13881";

      const ethChainId = "0x61";



      if (chainId !== ethChainId) {

        MySwal.fire({
          title: "Opsss?",
          text: "You are connected to the wrong network!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Change",
          cancelButtonText: "Cancel",
        }).then(async (result: any) => {
          if (result.isConfirmed) {
            try {
              await ethereum
                .request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x13881" }],
                })
                .then(() => {
                  if (ethereum) {
                    ethereum.on("chainChanged", async (chainId: any) => {
                      if ((chainId = "0x13881")) {
                        const accounts = await ethereum.request({
                          method: "eth_requestAccounts",
                        });
                        setWallet(accounts[0]);
                        setNetwork(true);
                        setNetworkName("BSC Testnet");
                      }
                    });
                  }
                });
            } catch (error: any) {
              if (error.code === 4902) {
                await ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: "0x13881",
                        chainName: "Mumbai Testnet",
                        nativeCurrency: {
                          name: "Mumbai Testnet",
                          symbol: "MATIC", // 2-6 characters long
                          decimals: 18,
                        },
                        blockExplorerUrls: ["https://polygonscan.com/"],
                        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                      },
                    ],
                  })
                  .then(() => {
                    if (ethereum) {
                      ethereum.on("chainChanged", async (chainId: any) => {
                        if ((chainId = "0x13881")) {
                          const accounts = await ethereum.request({
                            method: "eth_requestAccounts",
                          });
                          setWallet(accounts[0]);
                          setNetwork(true);
                          setNetworkName("BSC Testnet");
                        }
                      });
                    }
                  });
              }
            }
          }
        });


      } else {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setWallet(accounts[0]);
        setNetwork(true);
        setNetworkName("BSC Testnet");
      }
    } catch (error) { }
  };

  async function wrongWallet() {
    try {
      const { ethereum }: any = window;
      let chainId = await ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x13881") {
        setNetwork(false);
      } else {
        setNetwork(true);
      }
    } catch (e: any) { }
  }

  /*
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      wrongWallet();
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  */

  async function checkAccount() {
    const { ethereum }: any = window;
    if (metamusk == true) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        setWallet(accounts[0]);
      } else {
        setWallet(null);
        //await connectWallet()
      }
    }
  }


  /*
  useEffect(() => {
    if (wallet) {
      //@ts-ignore
       //@ts-ignore
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(Abifile, contractAddress); //@ts-ignore
      setContract(contract);
    }
  }, [Abifile, contractAddress, wallet]);
  */



  const paraYatir = async () => {
    if (depositCount == 0) {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return
    } else if (depositCount < 0) {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return
    }
    setMetamaskView(true);
    const maticCount = depositCount;
    contract.methods
      .deposit()
      .send({
        from: wallet,
        value: Web3.utils.toWei(depositCount, "ether"),
        gasLimit: 1000000,
      })
      .on("transactionHash", (hash: any) => {
      })
      .on("receipt", (receipt: any) => {
      })
      .on("confirmation", (confirmationNumber: any, receip: any) => {

        if (confirmationNumber == 1) {

          fetch("/api/deposit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              method: "makeMaticDeposit",
              API_KEY: process.env.API_KEY,
              userToken: getCookie("user"),
              amount: parseFloat(maticCount),
            }),
          }).then((res) => res.json())
            .then(data => {
              if (data.message == "Success") {
                setMetamaskView(false);
                getUser();
                setSucc(true);
                setSuccessMsgSnackbar("Transaction successful");
              } else {
                setMetamaskView(false);
                setErrMsgSnackbar("Transaction failed");
                setErr(true);
              }
            })

        }

      })
      .on("error", (error: any) => {
        console.error(error);
        setMetamaskView(false);
        setErrMsgSnackbar("Transaction failed");
        setErr(true);
      });

  };

  const paraCek = async () => {

    let miktar = (document.getElementById("withdraw") as HTMLInputElement).value;

    if (miktar == "0") {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return;
    } else if (miktar < "0") {
      setErrMsgSnackbar("Please enter a value greater than 0");
      setErr(true);
      return;
    }
    setWaiting(true);
    const res = await fetch('/api/paymentRequests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "new",
        API_KEY: process.env.API_KEY,
        userToken: getCookie("user"),
        email1: user?.email,
        withdrawAmount: miktar,
        walletTo: wallet,
        type: settings?.requestType
      })
    });

    

    const data = await res.json();

    if (data.status === false) {
      setErrMsgSnackbar(data.message);
      setWaiting(false);
      setErr(true);
    } else {
      getUser();
      setWaiting(false);
      setSucc(true);
      setSuccessMsgSnackbar("Your request has been sent successfully");
    }

  };

  

  const swapToCoin = async () => {
    if (user) {
      let miktar = (document.getElementById("swapToCoin") as HTMLInputElement).value;
      setWaiting(true);
      if (miktar == "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (miktar < "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (Number(miktar) > user?.maticBalance) {
        setErrMsgSnackbar("You do not have enough BNB");
        setErr(true);
        setWaiting(false);
        return
      }
      let response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "swapToCoin",
          API_KEY: process.env.API_KEY,
          userToken: getCookie("user"),
          amount: miktar,
        }),
      });
      let data = await response.json();
      if (data.status === false) {
        setErrMsgSnackbar(data.message);
        setErr(true);
        setWaiting(false);
        return
      } else {
        getUser();
        setWaiting(false);
        setSucc(true);
        setSuccessMsgSnackbar(data.message);
      }
    }
  };

  const swapToMatic = async () => {
    if (user) {
      let miktar = (document.getElementById("swapToMatic") as HTMLInputElement).value;
      setWaiting(true);
      if (miktar == "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (miktar < "0") {
        setErrMsgSnackbar("Please enter a value greater than 0");
        setErr(true);
        setWaiting(false);
        return
      } else if (Number(miktar) > user?.deposit) {
        setErrMsgSnackbar("You do not have enough Coin");
        setErr(true);
        setWaiting(false);
        return
      }

      let response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "swapToMatic",
          API_KEY: process.env.API_KEY,
          userToken: getCookie("user"),
          amount: miktar,
        }),
      });
      let data = await response.json();
      if (data.status === false) {
        setErrMsgSnackbar(data.message);
        setErr(true);
        setWaiting(false);
        return
      } else {
        getUser();
        setWaiting(false);
        setSucc(true);
        setSuccessMsgSnackbar(data.message);
      }
    }
  };


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3">
        <p>Loading...</p>
      </div>
    )
  }

  const handleClickSucc = () => {
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






	/**
	 * Fetches QR Code of the text input
	 */
  /*
	const getQrcode = async () => {
		try {
			const res = await axios.get('api/qrcode/', {
				params: {input}
			});
			setResponse(res.data);
		} catch (error) {
			console.log(error);
		}
	};
  */


  const sendAuthCode = async () => {

    if (!mobileNumber) {
        setErrMsgSnackbar("Mobile Number is required");
        handleClickErr();

        return;
    }

    const formInput = {
        method: 'sendAuthCode',
        API_KEY: process.env.API_KEY,
        userToken: getCookie("user"),
        mobileNumber: mobileNumber,
    };
    fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInput),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.data) {

          setSuccessMsgSnackbar(data.message);
          handleClickSucc();

            setAuthCodeState(true);

        } else {

          setErrMsgSnackbar(data.message);
          handleClickErr();

        }

    });

  }



const updateWalletAddress = async () => {

    if (!mobileNumber) {
        setErrMsgSnackbar("Mobile Number is required");
        handleClickErr();

        return;
    }

    if (!authCode) {
        setErrMsgSnackbar("Auth Code is required");
        handleClickErr();

        return;
    }

    const formInput = {
        method: 'updateWalletAddress',
        API_KEY: process.env.API_KEY,
        userToken: getCookie("user"),
        authCode: authCode,
    };
    fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInput),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.user) {

          getUser();

          setSuccessMsgSnackbar(data.message);
          handleClickSucc();

        } else {

          setErrMsgSnackbar(data.message);
          handleClickErr();

        }

    });

  }






  return (
    <>

    
      {metamaskview ? (
        <div
          onClick={() => {
            setMetamaskView(false);
          }}
          className="flex absolute min-w-full min-h-full bg-black/70 justify-center items-center "
        >
          <Image
            src="/metamask-fox.svg"
            width={100}
            height={100}
            alt="Metamask"
          />
        </div>
      ) : null}


      {waiting ? (
        <div
          className="flex absolute min-w-full min-h-full bg-black/70 justify-center items-center "
        >please wait...
        </div>
      ) : null}


      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-3 p-10 text-gray-100">
        <h3 className="text-center">Deposit And Withdraw</h3>

{/*
        <p className="text-center">
          Swap your BNB to {Coin.name} and start earning
        </p>
      */}


        <p className=" text-lg text-center">
          
          {/*
          Dear <span className="text-amber-500">{user.username}</span> you have{" "}
      */}

          <span className="text-[#BA8E09]">{Number(user?.deposit).toFixed(0)}</span>{" "}
          <span className="text-red-500  ">{Coin.name} </span>
          
          {/*
          and
          <span className="text-pink-500"> {((user.maticBalance).toString()).slice(0, 6)} BNB </span>
          */}
          
          in your account
        </p>
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 w-full lg:w-2/3 gap-5">

          
          {/* //? Matic Deposit  */}
          <div className="w-full border rounded-lg flex flex-col items-center justify-top p-2 gap-5 py-10">

            <h4 className=" ">
              Deposit <span className="text-sm text-red-500">(CARROT)</span>{" "}
            </h4>

            <div className='w-full max-w-xs md:w-1/2 '>


              <input
                  ///type="number"
                  placeholder="Wallet Address"
                  id="deposit"
                  ///value={depositCount}
                  value={user?.walletAddress}

                  //onChange={(e) => {
                  //    setDepositCount(e.target.value);
                  //}}

                  className="input input-bordered w-full max-w-xs text-gray-800 text-xl font-bold mb-5"
              />


              {!user?.walletAddress &&

                    <div className="w-full items-center justify-center text-gray-800">
                      <span className="text-sm text-red-500">You need to authorize your phone number.</span>

                    

                      <PhoneInput
                        country={'us'}
                        value={mobileNumber}
                        onChange={phone => setMobileNumber(phone)}
                        />

                        {authCodeState ?

                        <div className=" w-full flex flex-row gap-5 mt-5 ">
                            <input type="number" placeholder="Auth Code" id="authCode" onChange={(e) => {
                                setAuthCode(e.target.value);
                            }} className="input input-bordered w-full max-w-xs text-gray-800 mb-5" />

                            <Button variant="contained" color="primary" className=" l " onClick={() => {
                                updateWalletAddress();
                            }}> Verify </Button>
                        </div>

                        :

                        <Button
                            variant="contained" color="primary" 
                            className=" mt-5"
                            onClick={() => {
                                sendAuthCode();

                            }}
                        >
                            Sent Auth Code
                        </Button>

                        } 



                  </div>


              }

            </div>

            {user?.walletAddress &&
                <>
                    <div className='w-full flex flex-row items-center justify-center centent-center'>

                      {/*
                        <CC content={user?.walletAddress}/>
            */}


                        <Button
                          color="success" variant='contained' className='bg-green-500'
                          onClick={() =>
                            {
                              navigator.clipboard.writeText(user?.walletAddress);
                              setSucc(true);
                              setSuccessMsgSnackbar("Your wallet address copied to clipboard");
                            }
                          }
                      >
                          Copy
                      </Button>

                      

                    </div>

                    <div className='w-full flex flex-row items-center justify-center centent-center'>
                        <Canvas
                        text={user?.walletAddress}
                        options={{
                        //level: 'M',
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
            }


{/*
			<button
				className="mt-6 p-4 bg-active hover:opacity-90 rounded text-primary font-bold inline-flex"
				onClick={() => getQrcode()}
			>
				Generate QR Code
			</button>

              */}


{/*
            <button
              onClick={() => {
                paraYatir();
              }}
              className="btn btn-success max-w-xs w-full "
            >
              Deposit
            </button>
            */}

            <span className="ml-5 mr-5 content-center text-sm text-green-500 text-center">
              If you send coins to your wallet address, it will be processed automatically.
            </span>


      
            <Link 
              href={"/Landing/depositRequests"}
              className="  hover:opacity-50 ">
                List of Deposit Requests
            </Link>
  



          </div>

          

          {/* //? Matic Withdraw */}
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Withdraw <span className="text-sm text-red-500">(CARROT)</span>

            {/*  
              <span className="text-sm text-green-500">{`(${settings?.requestType === 'Matic' ? "BNB" : Coin.name})`}</span>{" "}
*/}
            </h4>


            <input
              placeholder="Wallet Address"
              onChange={(e) => {
                setWallet(e.target.value);
              }}
              className="input input-bordered w-full max-w-xs text-gray-800"
            />


            <input
              type="number"
              placeholder="Minimum 1,000"
              id="withdraw"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />


            <span className="ml-5 mr-5 content-center text-sm text-green-500">
                Withdraw amount is at least <br></br>1,000 ~ maximum 10,000 CARROT at a time
            </span>

            <span className="ml-5 mr-5 content-center text-sm text-white">
                Withdraw Fee 100 CARROT
            </span>
 

            <button onClick={paraCek} className="btn btn-accent max-w-xs w-full">Withdraw</button>


            <Link href={"/Landing/withdrawRequests"} className="hover:opacity-50">
                List of Withdraw Requests
            </Link>

          </div>

          {/* //? Swap Matic to Coin */}
          {/*
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Swap <span className="text-xs ">(BNB to {Coin.name})</span>{" "}
            </h4>
            <p className="text-xs "> 1 MATIC = x{Coin.katSayi} {Coin.name} </p>
            <input
              type="number"
              placeholder="Type here"
              id="swapToCoin"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            <button onClick={swapToCoin} className="btn btn-primary max-w-xs w-full">Swap to {Coin.name}</button>
          </div>
          */}


          {/* //? Swap Coin to Matic */}
          {/*
          <div className="w-full border rounded-lg flex flex-col items-center p-2 justify-center gap-5 py-10">
            <h4 className=" ">
              Swap <span className="text-xs ">({Coin.name} to MATIC)</span>{" "}
            </h4>
            <p className="text-xs "> 1 {Coin.katSayi} {Coin.name} = 1/{Coin.katSayi} BNB </p>
            <input
              type="number"
              placeholder="Type here"
              id="swapToMatic"
              className="input input-bordered w-full max-w-xs text-gray-800"
            />
            <button onClick={swapToMatic} className="btn btn-secondary max-w-xs w-full">Swap to BNB</button>
          </div>
          */}

        </div>
      </div>

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


    </>
  )
}
