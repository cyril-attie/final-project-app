const fs=require('fs');
const Web3 = require('web3');
// const JSON=require('JSON')

//Define abi and address as well as create a web3 1.2.5 instance 

const ethjson=require('./build/contracts/EthMov.json');
const ABI = ethjson.abi;
const EMADDRESS = '0xD43A429Fa90F01045Ec43D084DA5e8f97fa343c0';

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


const EMinstance = new web3.eth.Contract(ABI, EMADDRESS);
const addresses = web3.eth.accounts.privateKeyToAccount(privateKey);
let _sizeCategory = 0;
let _weightCategory = 0;
let _itinerary = [48.861700, 2.343343, 37.789617, -122.390179].map(x => x * 10 ** 6);;
let _maxDeliveryTimestamp = 1581634800.0;
let _weiPacketValue = web3.utils.toWei('0.06', 'ether');
let _bidPrice = web3.utils.toWei('0.09', 'ether');

let transportDemand1 = [addresses[0], _sizeCategory, _weightCategory, _itinerary, _maxDeliveryTimestamp, _weiPacketValue, _bidPrice];



EMinstance.methods.demandTransport(transportDemand1).call().then(console.log); 
/* 
 
fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
}); */

  