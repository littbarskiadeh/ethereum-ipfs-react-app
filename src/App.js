import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import ipfs from "./ipfs";
import storehash from "./storehash";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

class App extends Component {
  state = {
    ipfsHash: null,
    buffer: "",
    ethAddress: "",
  };
  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };
  convertToBuffer = async (reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };
  onClick = async () => {
    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });

      await web3.eth.getTransactionReceipt(
        this.state.transactionHash,
        (err, txReceipt) => {
          console.log(err, txReceipt);
          this.setState({ txReceipt });
        }
      ); //await for getTransactionReceipt
      await this.setState({ blockNumber: this.state.txReceipt.blockNumber });
      await this.setState({ gasUsed: this.state.txReceipt.gasUsed });
    } catch (error) {
      //try
      console.log(error);
    } //catch
  }; //onClick

  onSubmit = async (event) => {
    event.preventDefault();

    //bring in user's metamask account address
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();

    //  console.log(accounts)
    console.log("Sending from Metamask account: " + accounts[0]);

    //obtain contract address from storehash.js
    const ethAddress = await storehash.options.address;
    this.setState({ ethAddress });

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
    await ipfs.files.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);

      this.setState({ ipfsHash: ipfsHash[0].hash });

      // write hash to blockchain by calling sendHash() from the smart contract
      storehash.methods.sendHash(this.state.ipfsHash).send(
        {
          from: accounts[0], //changed from accounts[0]
        },
        (error, transactionHash) => {
          console.log(transactionHash);
          this.setState({ transactionHash });
        }
      ); //storehash
    }); //await ipfs.add
  }; //onSubmit

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Ethereum and IPFS with Create React App</h1>
        </header>

        <hr />

        <h3> Choose file to send to IPFS </h3>
        <Form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <Button variant="primary" type="submit">
            Send it
          </Button>
        </Form>

        <hr />

        <h4>IPFS Hash from contract: {this.state.ipfsHash}</h4>
        <h4>Ethereum contract Address: {this.state.ethAddress}</h4>

        <hr />

        <h4>Your image</h4>
        {this.state.ipfsHash ? (
          <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
        ) : null}
      </div>
    );
  } //render
} //App
export default App;
