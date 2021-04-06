import { Component, OnInit } from '@angular/core';

export interface Protocol {
  name: string;
  logo: string;
  dai: string;
  usdc: string;
  tether: string;
}
const aaveLogo = '../../assets/aave.svg'
const compoundLogo = '../../assets/compound.svg'
const curveLogo = '../../assets/curve.svg'
const idleFinanceLogo = '../../assets/idleFinance.svg'
const yearnLogo = '../../assets/yearn.png'

const INTEREST_RATES: Protocol[] = [
  { name: 'Aave', logo: aaveLogo, dai: '11.40', usdc: '10.70', tether: '6.91'},
  { name: 'Curve Y', logo: curveLogo, dai: '6.62', usdc: '6.62', tether: '6.62'},
  { name: 'Compound', logo: compoundLogo, dai: '5.56', usdc: '5.26', tether: '2.97'},
  { name: 'Idle Finance', logo: idleFinanceLogo, dai: '10.50', usdc: '9.90', tether: '7.15'},
  { name: 'Yearn Vaults', logo: yearnLogo, dai: '17.65', usdc: '16.83', tether: '8.01'},
]
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  daiLogo = '../../assets/dai.svg'
  usdcLogo = '../../assets/usdc.svg'
  usdtLogo = '../../assets/usdt.svg'


  displayedColumns: string[] = ['protocol','dai', 'usdc', 'tether'];
  dataSource = INTEREST_RATES
}
