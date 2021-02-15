//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

//run with local daemon
// const ipfsApi = require('ipfs-api');
// const createClient = require('ipfs-http-client');
// const ipfs = createClient('localhost', '5001', {protocol:'http'});
// const ipfs = createClient();


export default ipfs;