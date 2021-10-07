import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const tokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';


function App() {
  const [greeting, setGreetingValue] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);

  async function requestAccount() {

    // Button tutorial - https://docs.metamask.io/guide/create-dapp.html#basic-action-part-1

    // request account info from metamask wallet
    // will prompt user to connect their wallet if haven't already
    try{
        await window.ethereum.request({ method:'eth_requestAccounts' });
    } catch (err) {
        console.log(err);
    }
    
  }


  async function getBalance() {

    if (typeof window.ethereum !== 'undefined') {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
        const balance = await contract.balanceOf(account);

        console.log("Balance: ", balance.toString());
    }

  }


  async function sendCoins() {

    if (typeof window.ethereum !== 'undefined') {
        await requestAccount();
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
        const transaction = await contract.transfer(userAccount, amount);

        await transaction.wait();

        console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }

  }


  async function fetchGreeting() {

    // window.ethereum will be there if the user is connected with metamask
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);

        try {
            const data = await contract.greet();
            console.log('data: ', data);
        } catch (err) {
            console.log('Error: ', err);
        }
    }

  }


  async function setGreeting() {

    if (!greeting) return; // make sure a greeting was entered
    if (typeof window.ethereum !== 'undefined') {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(); //  signer is used to sign the transaction
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
        const transaction = await contract.setGreeting(greeting);
        // setGreetingValue('');

        await transaction.wait(); // wait for the transaction to be confirmed on the blockchain

        fetchGreeting();
    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={requestAccount}>Connect Wallet</button>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>        
        <input 
            onChange={e => setGreetingValue(e.target.value)} 
            placeholder="Set greeting" 
            value={greeting}
        />

        <br />

        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input 
            onChange={e => setUserAccount(e.target.value)} 
            placeholder="Account ID" 
        />
        <input 
            onChange={e => setAmount(e.target.value)} 
            placeholder="Amount" 
        />
        

      </header>
    </div>
  );
}

export default App;
