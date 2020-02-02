
const EthMov = artifacts.require("EthMov");
// const Withdrawal = artifacts.require("Withdrawal");
// let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('EthMov', async (accounts) => {
    
    const customer1 = accounts[0];
    const customer2 = accounts[1];
    const transporter1 = accounts[2];
    const transporter2 = accounts[3];
    const transporter3 = accounts[4];
    const destination = accounts[5];
    const emptyAddress = '0x0000000000000000000000000000000000000000';

    it('should be empty', async () => {   
        let instance = await EthMov.deployed();    
        let transport1 = await instance.transportDemandPool.call(1);
        assert.equal(transport1.fromAddress, emptyAddress, 'Storage should be empty');
    });

    it('should be able to create a transport demand', async () => {
        let instance = await EthMov.deployed();
        let _sizeCategory = 0;
        let _weightCategory = 0;
        let _itinerary = [48.861700, 2.343343, 37.789617, -122.390179].map(x => x * 10 ** 6);;
        let _maxDeliveryTimestamp = 1581634800.0;
        let _weiPacketValue = web3.utils.toWei('0.06', 'ether');
        let _bidPrice = web3.utils.toWei('0.09', 'ether');

        const transportDemand1 = [destination, _sizeCategory, _weightCategory, _itinerary, _maxDeliveryTimestamp, _weiPacketValue, _bidPrice];
        await instance.demandTransport.sendTransaction(...transportDemand1,{from:customer1});

        const transportDemand2 = [destination, _sizeCategory, _weightCategory, _itinerary, _maxDeliveryTimestamp, _weiPacketValue, _bidPrice];
        await instance.demandTransport.sendTransaction(...transportDemand2,{from:customer2});

        const transportDemand3 = [destination, _sizeCategory, _weightCategory, _itinerary, _maxDeliveryTimestamp, _weiPacketValue, _bidPrice];
        await instance.demandTransport.sendTransaction(...transportDemand3,{from:customer2});

        let transport1 = await instance.transportDemandPool.call(1);
        assert.equal(transport1.fromAddress, customer1, 'Transport demands should be recorded');
    });

    it('should store and view list of available offers for particular transport demand', async () => {
        let instance = await EthMov.deployed();
        
        let txId = 1;
        await instance.supplyTransport.sendTransaction(...[txId,web3.utils.toWei('0.11', 'ether')],{from:transporter1});
        await instance.supplyTransport.sendTransaction(...[txId,web3.utils.toWei('0.12', 'ether')],{from:transporter2});
        await instance.supplyTransport.sendTransaction(...[txId,web3.utils.toWei('0.13', 'ether')],{from:transporter3});
        let transportSuppliesLength = (await instance.getAvailableTransportSupplyLength.call(txId)).toNumber();
        assert.equal(transportSuppliesLength,3,'Supplies list is not 3 after adding 3 supplies. Supplies not well recorded.') 
        let supplyId = 0;
        let transportSupply1 = await instance.AvailableTransportSupply.call(txId,supplyId);
        assert.equal(transportSupply1.transporter, transporter1, 'Transporter of transport1 should be transporter1');
       
    });

    it('should cancel transport demand', async () => {
        let instance = await EthMov.deployed();

        let txId = 2; 
        await instance.cancelTransportDemand.sendTransaction([txId],{from:customer2});
        let transport2 = await instance.transportDemandPool.call(txId);

        assert.equal(transport2.fromAddress, emptyAddress, "Demand was deleted but fromAddress is not empty");
    });
    
    
    it('should cancel supply offer', async () => {
        let instance = await EthMov.deployed();

        let txId = 1;
        let supplyId =1;
        let transportSupplyAddressBefore = (await instance.AvailableTransportSupply.call(txId,supplyId)).transporter;
        await instance.cancelTransportSupply.sendTransaction(txId,{from:transporter2});
        let transportSupplyAddressAfter = (await instance.AvailableTransportSupply.call(txId,supplyId)).transporter;

        assert.notEqual(transportSupplyAddressBefore, emptyAddress, "Supply was not deleted correctly");
        assert.equal(transportSupplyAddressAfter, emptyAddress, "Supply was not deleted correctly");
    });
    
    // it('should record transportation allocation', async () => {

    // };)
    
    // it('should record pick up', async () => {

    // };)

    // it('should record delivery', async () => {

    // };)
});

