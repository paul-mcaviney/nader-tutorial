import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddres = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


function App() {
  const [greeting, setGreetingValue] = useState();

  async function requestAccount() {

    // request account info from metamask wallet
    // will prompt user to connect their wallet if haven't already
    await window.ethereum.request({ method: 'eth_requestAccounts' });

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

        await transaction.wait(); // wait for the transaction to be updated on the network

        fetchGreeting();
    }

  }

  return (
    <div className="App">
      <header className="App-header">
        
        

      </header>
    </div>
  );
}

export default App;
