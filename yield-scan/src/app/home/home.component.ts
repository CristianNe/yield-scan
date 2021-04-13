import { Component, OnInit } from '@angular/core';
import {HttpClientService} from "../http/httpclient.service";

export interface Protocol {
  name: string;
  logo: string;
  dai: string;
  usdc: string;
  usdt: string;
}
const aaveLogo = '../../assets/aave.svg'
const compoundLogo = '../../assets/compound.svg'
const curveLogo = '../../assets/curve.svg'
const idleFinanceLogo = '../../assets/idleFinance.svg'
const yearnLogo = '../../assets/yearn.png'

const INTEREST_RATES: Protocol[] = [
  { name: 'Aave', logo: aaveLogo, dai: '11.40', usdc: '10.70', usdt: '6.91'},
  { name: 'Curve Y', logo: curveLogo, dai: '6.62', usdc: '6.62', usdt: '6.62'},
  { name: 'Compound', logo: compoundLogo, dai: '5.56', usdc: '5.26', usdt: '2.97'},
  { name: 'Idle Finance', logo: idleFinanceLogo, dai: '10.50', usdc: '9.90', usdt: '7.15'},
  { name: 'Yearn Vaults', logo: yearnLogo, dai: '17.65', usdc: '16.83', usdt: '8.01'},
]
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public httpService: HttpClientService) { }

  ngOnInit(): void {
    this.fetchAaveInterestRates();
  }

  stablecoins = ['dai', 'usdt', 'usdc']
  daiLogo = '../../assets/dai.svg'
  usdcLogo = '../../assets/usdc.svg'
  usdtLogo = '../../assets/usdt.svg'

  aaveProtocol: Protocol =  { name: 'Aave', logo: aaveLogo, dai: '', usdc: '', usdt: ''};
  yearnProtocol: Protocol = { name: 'Yearn Vaults', logo: yearnLogo, dai: '', usdc: '', usdt: ''};
  compoundProtocol: Protocol = { name: 'Compound', logo: compoundLogo, dai: '', usdc: '', usdt: ''};
  idleFinanceProtocol: Protocol = { name: 'Idle Finance', logo: idleFinanceLogo, dai: '', usdc: '', usdt: ''};
  curveProtocol: Protocol = { name: 'Curve Y', logo: curveLogo, dai: '', usdc: '', usdt: ''};


  displayedColumns: string[] = ['protocol','dai', 'usdc', 'tether'];
  dataSource = [this.aaveProtocol, this.compoundProtocol, this.yearnProtocol, this.idleFinanceProtocol, this.curveProtocol];

  fetchAaveInterestRates(): void {
    this.httpService.getAavePools().subscribe((res) => {
      let interestRates = this.extractInterestRates(res, 'liquidityRate');
        this.aaveProtocol.usdc = interestRates.usdc;
        this.aaveProtocol.usdt = interestRates.usdt;
        this.aaveProtocol.dai = interestRates.dai;
    },
      (error => {
        console.log(error);
      }),
      () => {
      console.log('fetchAaveInterestRates: complete');
      console.log(this.aaveProtocol);
      this.dataSource[0] = this.aaveProtocol;
      })
  }

  fetchCompoundInterestRates(): void {
    this.httpService.getCompoundPools().subscribe((res) => {
        let interestRates = this.extractInterestRates(res, 'liquidityRate');
        this.aaveProtocol.usdc = interestRates.usdc;
        this.aaveProtocol.usdt = interestRates.usdt;
        this.aaveProtocol.dai = interestRates.dai;
      },
      (error => {
        console.log(error);
      }),
      () => {
        console.log('fetchAaveInterestRates: complete');
        console.log(this.aaveProtocol);
        this.dataSource[0] = this.aaveProtocol;
      })
  }

  fetchYearnInterestRates(): void {
    this.httpService.getYearnVaults().subscribe((res) => {
        let interestRates = this.extractInterestRates(res, 'apyOneWeekSample');
        this.yearnProtocol.usdc = interestRates.usdc;
        this.yearnProtocol.usdt = interestRates.usdt;
        this.yearnProtocol.dai = interestRates.dai;
      },
      (error => {
        console.log(error);
      }),
      () => {
        console.log('fetchYearnInterestRates: complete');
        console.log(this.yearnProtocol);
        this.dataSource[2] = this.yearnProtocol;
      })
  }

  extractInterestRates(data: any, key: string): any{
    let daiRate = ''
    let usdtRate = ''
    let usdcRate = ''

    for(let i=0; i < data.length; i++){

      if(data[i].symbol.toLowerCase() == 'dai'){
        daiRate = data[i][key];
      }
      else if(data[i].symbol.toLowerCase() == 'usdt'){
        usdtRate = data[i][key];
      }
      else if(data[i].symbol.toLowerCase() == 'usdc'){
        usdcRate = data[i][key];
      }

      if(daiRate != '' && usdtRate != '' && usdcRate != ''){
        console.log('extractAaveInterestRates done!');
        usdtRate = (Number(usdtRate) * 100).toFixed(2);
        daiRate = (Number(daiRate) * 100).toFixed(2);
        usdcRate = (Number(usdcRate) * 100).toFixed(2);
        return {'usdt': usdtRate, 'usdc': usdcRate, 'dai': daiRate};
      }
    }
    return {'usdt': usdtRate, 'usdc': usdcRate, 'dai': daiRate};
  }

}
