import { Component, OnInit } from '@angular/core';
import { HttpClientService } from "../http/httpclient.service";

/**
 * The general interface of how we structure a Lending & Borrowing Protocol
 * @logo: Path to the image file of the Protocol. All image files are to be stored in ./src/assets folder
 * @stablecoins: the APY in % of the protocol for that stablecoin in fixed point notation with 2 digits, e.g. 4.05
 */
export interface Protocol {
  name: string,
  logo: string,
  dai: string,
  usdc: string,
  usdt: string,
  busd: string,
  susd: string,
  tusd: string
}

/**
 * Interface for Arguments of extractInterestRates() function
 * @data: the fetched JSON data from the API's of the respective protocol.
 * @apyKey: the name of the key in `data` that contains the APY values
 * @transform: whether the APY values received need to be transformed into % notation or not, e.g. 0.054 (transform: true) -> 5.40
 * @symbolVar: the name of the key containing the Cryptocurrency symbol. Default value if not specified: `'symbol'`
 * @stablecoinSymbol: the respective name of the stablecoin within the returned `data`. By default the name itself, e.g. 'dai' for Dai.
 */
export interface iextractInterestRates {
  data: any[],
  apyKey: string,
  transform: boolean,
  symbolVar?: string,
  daiSymbol?: string,
  usdtSymbol?: string,
  usdcSymbol?: string,
  busdSymbol?: string,
  susdSymbol?: string,
  tusdSymbol?: string
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
    this.fetch88MphInterestRates();
    this.fetchVenusInterestRates();
    this.fetchDefinerInterestRates();
  }

  daiLogo = '../../assets/dai.svg'
  usdtLogo = '../../assets/usdt.svg'
  usdcLogo = '../../assets/usdc.svg'
  busdLogo = '../../assets/busd.svg'
  susdLogo = '../../assets/susd.svg'
  tusdLogo = '../../assets/tusd.svg'

  aaveLogo = '../../assets/aave.svg'
  compoundLogo = '../../assets/compound.svg'
  yearnLogo = '../../assets/yearn.png'
  _88mphLogo = '../../assets/88mph.png'
  venusLogo = '../../assets/venus.png'
  definerLogo = '../../assets/definer.jpg'
  curveLogo = '../../assets/curve.svg'
  idleFinanceLogo = '../../assets/idleFinance.svg'

  aaveProtocol: Protocol = { name: 'Aave', logo: this.aaveLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };
  yearnProtocol: Protocol = { name: 'Yearn Vaults', logo: this.yearnLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };
  compoundProtocol: Protocol = { name: 'Compound', logo: this.compoundLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };
  _88mphProtocol: Protocol = { name: '88MPH', logo: this._88mphLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };
  venusProtocol: Protocol = { name: 'Venus', logo: this.venusLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };
  definerProtocol: Protocol = { name: 'Definer', logo: this.definerLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };
  curveProtocol: Protocol = { name: 'Curve Y', logo: this.curveLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };
  idleFinanceProtocol: Protocol = { name: 'Idle Finance', logo: this.idleFinanceLogo, dai: '', usdc: '', usdt: '', busd: '', susd: '', tusd: '' };

  displayedColumns: string[] = ['protocol', 'dai', 'usdt', 'usdc', 'busd', 'susd', 'tusd'];
  dataSource = [
    this.aaveProtocol,
    this.compoundProtocol,
    this.yearnProtocol,
    this._88mphProtocol,
    this.venusProtocol,
    this.definerProtocol,
    this.idleFinanceProtocol,
    this.curveProtocol
  ];

  fetchAaveInterestRates(): void {
    this.httpService.getAavePools().subscribe((res) => {
      let interestRates = this.extractInterestRates({ data: res, apyKey: 'liquidityRate', transform: true });
      this.fillProtocolInterestRates(this.aaveProtocol, interestRates);
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
      let interestRates = this.extractInterestRates({
        data: res.cToken, apyKey: 'supply_rate', transform: true,
        daiSymbol: 'cdai', usdtSymbol: 'cusdt', usdcSymbol: 'cusdc'
      });
      this.fillProtocolInterestRates(this.compoundProtocol, interestRates);
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
      let interestRates = this.extractInterestRates({ data: res, apyKey: 'apyOneWeekSample', transform: false });
      this.fillProtocolInterestRates(this.yearnProtocol, interestRates);
    },
      (error => {
        console.log(error);
      }),
      () => {
        this.dataSource[2] = this.yearnProtocol;
      })
  }

  fetch88MphInterestRates(): void {
    this.httpService.get88MmphPools().subscribe((res) => {
      // Yearn Vaults typically displays weekly apy
      let interestRates = this.extractInterestRates({ data: res, apyKey: 'oneYearInterestRate', symbolVar: 'tokenSymbol', transform: false });
      this.fillProtocolInterestRates(this._88mphProtocol, interestRates);
    },
      (error => {
        console.log(error);
      }),
      () => {
        this.dataSource[3] = this._88mphProtocol;
      })
  }

  fetchVenusInterestRates(): void {
    this.httpService.getVenusPools().subscribe((res) => {
      // Yearn Vaults typically displays weekly apy
      let interestRates = this.extractInterestRates({ data: res.data.markets, apyKey: 'supplyApy', symbolVar: 'underlyingSymbol', transform: false });
      this.fillProtocolInterestRates(this.venusProtocol, interestRates);
    },
      (error => {
        console.log(error);
      }),
      () => {
        this.dataSource[4] = this.venusProtocol;
      })
  }

  fetchDefinerInterestRates(): void {
    this.httpService.getDefinerPools().subscribe((res) => {
      // Yearn Vaults typically displays weekly apy
      let interestRates = this.extractInterestRates({ data: res.data, apyKey: 'deposit_apr', transform: false });
      this.fillProtocolInterestRates(this.definerProtocol, interestRates);
    },
      (error => {
        console.log(error);
      }),
      () => {
        this.dataSource[5] = this.definerProtocol;
      })
  }

  // ToDo: fetchCurveInterestRates()

  /***
   * @description: Extracts the the Stablecoin APY rates
   * @params: configuration parameters as `iextractInterestRates`. Inspect the returned data from Protocol to know how to configure.
   */
  extractInterestRates(params: iextractInterestRates): any {

    let rates = new Map()
    rates.set('dai', 0)
    rates.set('usdt', 0)
    rates.set('usdc', 0)
    rates.set('busd', 0)
    rates.set('susd', 0)
    rates.set('tusd', 0)

    let symbols = new Map()
    symbols.set((params.daiSymbol != undefined) ? params.daiSymbol : 'dai', 'dai');
    symbols.set((params.usdtSymbol != undefined) ? params.usdtSymbol : 'usdt', 'usdt');
    symbols.set((params.usdcSymbol != undefined) ? params.usdcSymbol : 'usdc', 'usdc');
    symbols.set((params.busdSymbol != undefined) ? params.busdSymbol : 'busd', 'busd');
    symbols.set((params.susdSymbol != undefined) ? params.susdSymbol : 'susd', 'susd');
    symbols.set((params.tusdSymbol != undefined) ? params.tusdSymbol : 'tusd', 'tusd');

    let symbol = (params.symbolVar != undefined) ? params.symbolVar : 'symbol';

    for (let i = 0; i < params.data.length; i++) {
      let ticker = params.data[i][symbol].toLowerCase()
      if (symbols.has(ticker)) {
        let stablecoin = symbols.get(ticker)
        rates.set(stablecoin, params.data[i][params.apyKey]);
        if (typeof rates.get(stablecoin) == 'object') {
          rates.set(stablecoin, rates.get(stablecoin).value);
        }
      }
    }
    if (params.transform) {
      rates.forEach((rate, key) => {
        rates.set(key, Number(rate) * 100)
      })
    }
    let data: any = {}
    symbols.forEach((symbol) => {
      data[symbol] = (rates.get(symbol) == 0) ? '--' : Number(rates.get(symbol)).toFixed(2);
    });
    return data
  }

  fillProtocolInterestRates(protocol: Protocol, interestRates: any): void {
    protocol.dai = interestRates.dai;
    protocol.usdt = interestRates.usdt;
    protocol.usdc = interestRates.usdc;
    protocol.busd = interestRates.busd;
    protocol.susd = interestRates.susd;
    protocol.tusd = interestRates.tusd;
  }

}
