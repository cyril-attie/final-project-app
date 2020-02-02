import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;
const ethmov_artifacts = require('../../../../build/contracts/EthMov.json');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  accounts: string[];
  EthMov: any;

  model = {
    transportDemandPool: [],
    transportSupplyPool:{},
    transportCount : 0,
    account:'',
    balance:0
  };

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(ethmov_artifacts)
      .then((EthMovAbstraction) => {
        this.EthMov = EthMovAbstraction;
        this.EthMov.deployed().then(deployed => {
          console.log(deployed);
          deployed.TransportDemanded({}, (ev, err) => {
            console.log('Transport demanded, refreshing pool');
            this.refreshTransportDemandPool();
          });
          deployed.TransportSupplied({}, (ev,err) => {
            console.log('Transport supplied, refreshing available supplies pool');
            console.log(ev);
            // this.refreshTransportSupplyPool();
          });
          deployed.TransportationAllocated({}, (ev,err) => {
            console.log('Transport allocated, refreshing pool');
            this.refreshTransportDemandPool();
          });
          //pickup event
          deployed.PickUp({}, (ev,err) => {
            console.log('Packet picked up, refreshing pool');
            this.refreshTransportDemandPool();
          });
          deployed.Delivery({}, (ev,err) => {
            console.log('Packet delivered, refreshing pool');
            this.refreshTransportDemandPool();
          });
          deployed.AllocatedTransportSupplyCancelled({}, (ev,err) => {
            console.log('Allocated supply cancelled, refreshing supply and demand pools');
            this.refreshTransportDemandPool();
            // this.refreshTransportSupplyPool();
          });
          deployed.UnallocatedTransportSupplyCancelled({}, (ev,err) => {
            console.log('Allocated supply cancelled, refreshing supply and demand pools');
            // this.refreshTransportSupplyPool();
          });
        });
      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshPendingWithdrawal();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  async refreshPendingWithdrawal() {
    console.log('Refreshing pending withdrawals');

    try {
      const deployedEthMov : any = await this.EthMov.deployed();
      const pendingWithdrawalBalance = await deployedEthMov.pendingWithdrawals.call(this.model.account);
      this.model.balance = pendingWithdrawalBalance ;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  async refreshTransportDemandPool() {
    console.log('Refreshing Transport Demand Pool');

    try {
      const deployedEthMov : any = await this.EthMov.deployed();
      const EthMovDemandPoolNum: number = await deployedEthMov.numTransports.call().toNumber();
      let EthMovDemandPool : Object[];
      for (let i : number = 1; i < EthMovDemandPoolNum;i++) {
        let transporti : Object = await deployedEthMov.transportDemandPool.call(i);
        //add object to ethdemandpool only if non-empty
        console.log('transport '+i.toString()+' is \n', transporti)
      }
      this.model.transportDemandPool = EthMovDemandPool;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  async refreshTransportSupplyPool(_transportId:number) {
    console.log('Refreshing Transport supply Pool');

    try {
      const deployedEthMov : any = await this.EthMov.deployed();
      const EthMovSupplyPoolNum: number = await deployedEthMov.getAvailableTransportSupplyLength.call(_transportId).toNumber();
      let EthMovSupplyPool : Object[];
      let supplyi : Object;
      for (let i : number = 1; i < EthMovSupplyPoolNum;i++) {
        supplyi = await deployedEthMov.AvailbleTransportSupply.call(_transportId,i);
        //add object to ethsupplypool only if non-empty
        EthMovSupplyPool.push(supplyi);
      }
      console.log('transport '+_transportId.toString()+' has ' +EthMovSupplyPoolNum.toString()+' Supplies \n', EthMovSupplyPool)
      this.model.transportSupplyPool[_transportId] = EthMovSupplyPool;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

}
