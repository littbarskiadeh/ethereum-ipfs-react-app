import web3 from "./web3";
//Contract address
const address = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";
//Contract ABI
const abi = [
  {
    constant: false,
    inputs: [
      {
        name: "x",
        type: "string",
      },
    ],
    name: "sendHash",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getHash",
    outputs: [
      {
        name: "x",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export default new web3.eth.Contract(abi, address);
