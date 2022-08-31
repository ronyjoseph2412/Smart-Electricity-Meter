import { useEffect, useState } from "react";
import WalletContext from "./WalletContext";

const WalletState = (props)=>{

    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [account, setAccount] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setIsWalletConnected(true);
        setAccount(account);
        console.log("Account Connected: ", account);
      } else {
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [account])
  

    return(
        <WalletContext.Provider value={{checkIfWalletIsConnected, isWalletConnected, account}}>
            {props.children}
        </WalletContext.Provider>
    )
}

export default WalletState;