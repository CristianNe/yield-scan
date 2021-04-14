import { Component, OnInit } from '@angular/core';
import {HttpClientService} from "../http/httpclient.service";

export interface Protocol {
  name: string;
  logo: string;
  dai: string;
  usdc: string;
  usdt: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public httpService: HttpClientService) { }

  ngOnInit(): void {
    this.fetchAaveInterestRates();
    this.fetchCompoundInterestRates();
    this.fetchYearnInterestRates();
  }

  stablecoins = ['dai', 'usdt', 'usdc']
  daiLogo = '../../assets/dai.svg'
  usdcLogo = '../../assets/usdc.svg'
  usdtLogo = '../../assets/usdt.svg'

  aaveLogo = '../../assets/aave.svg'
  compoundLogo = '../../assets/compound.svg'
  curveLogo = '../../assets/curve.svg'
  idleFinanceLogo = '../../assets/idleFinance.svg'
  yearnLogo = '../../assets/yearn.png'

  aaveProtocol: Protocol =  { name: 'Aave', logo: this.aaveLogo, dai: '', usdc: '', usdt: ''};
  yearnProtocol: Protocol = { name: 'Yearn Vaults', logo: this.yearnLogo, dai: '', usdc: '', usdt: ''};
  compoundProtocol: Protocol = { name: 'Compound', logo: this.compoundLogo, dai: '', usdc: '', usdt: ''};
  idleFinanceProtocol: Protocol = { name: 'Idle Finance', logo: this.idleFinanceLogo, dai: '', usdc: '', usdt: ''};
  curveProtocol: Protocol = { name: 'Curve Y', logo: this.curveLogo, dai: '', usdc: '', usdt: ''};

  displayedColumns: string[] = ['protocol','dai', 'usdc', 'usdt'];
  dataSource = [this.aaveProtocol, this.compoundProtocol, this.yearnProtocol, this.idleFinanceProtocol, this.curveProtocol];

  fetchAaveInterestRates(): void {
    this.httpService.getAavePools().subscribe((res) => {
      let interestRates = this.extractInterestRates(res, 'liquidityRate', true);
      this.aaveProtocol.usdt = interestRates.usdt;
      this.aaveProtocol.dai = interestRates.dai;
      this.aaveProtocol.usdc = interestRates.usdc;

    },
      (error => {
        console.log(error);
      }),
      () => {
      this.dataSource[0] = this.aaveProtocol;
      })
  }

  fetchCompoundInterestRates(): void {
    this.httpService.getCompoundPools().subscribe((res) => {
        let interestRates = this.extractInterestRates(res.cToken, 'supply_rate', true, 'cdai', 'cusdt', 'cusdc');
        this.compoundProtocol.usdc = interestRates.usdc;
        this.compoundProtocol.usdt = interestRates.usdt;
        this.compoundProtocol.dai = interestRates.dai;
      },
      (error => {
        console.log(error);
      }),
      () => {
        this.dataSource[1] = this.compoundProtocol;
      })
  }

  fetchYearnInterestRates(): void {
    this.httpService.getYearnVaults().subscribe((res) => {
      // Yearn Vaults typically displays weekly apy
        let interestRates = this.extractInterestRates(res, 'apyOneWeekSample');
        this.yearnProtocol.usdc = interestRates.usdc;
        this.yearnProtocol.usdt = interestRates.usdt;
        this.yearnProtocol.dai = interestRates.dai;
      },
      (error => {
        console.log(error);
      }),
      () => {
        this.dataSource[2] = this.yearnProtocol;
      })
  }

  extractInterestRates(data: any, key: string,  transform: boolean = false, daiSymbol?: string,
                        usdtSymbol?: string, usdcSymbol?: string): any{
    let daiRate: any = ''
    let usdtRate: any = ''
    let usdcRate: any = ''

    let dai = (daiSymbol != undefined) ? daiSymbol : 'dai';
    let usdt = (usdtSymbol != undefined) ? usdtSymbol : 'usdt';
    let usdc = (usdcSymbol != undefined) ? usdcSymbol : 'usdc';

    for(let i=0; i < data.length; i++){

      if(data[i].symbol.toLowerCase() == dai){
        daiRate = data[i][key];
        if(typeof daiRate == 'object'){
          daiRate = daiRate.value;
        }
      }
      else if(data[i].symbol.toLowerCase() == usdt){
        usdtRate = data[i][key];
        if(typeof usdtRate == 'object'){
          usdtRate = usdtRate.value;
        }
      }
      else if(data[i].symbol.toLowerCase() == usdc){
        usdcRate = data[i][key];
        if(typeof usdcRate == 'object'){
          usdcRate = usdcRate.value;
        }
      }
      if(daiRate != '' && usdtRate != '' && usdcRate != ''){

        if(transform){
          usdcRate = Number(usdcRate) * 100;
          usdtRate = Number(usdtRate) * 100;
          daiRate = Number(daiRate) * 100;
        }

        return {
          'usdt': Number(usdtRate).toFixed(2),
          'usdc': Number(usdcRate).toFixed(2),
          'dai': Number(daiRate).toFixed(2)
        };
      }
    }
    return {'usdt': usdtRate, 'usdc': usdcRate, 'dai': daiRate};
  }

}
