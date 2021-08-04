# App

## Home

The Home component displays an overview of APY rates of different Lending&Borrowing Protocols for Stablecoins. 
It is located in the `/home` folder. 
`home.component.ts`: TypeScript File containing the logic of the home component.
When adding a new Protocol, add the respective `fetchProtocolRates()`function there.

## Http

The Http component takes care of all http requests to the REST API's.
It is located in the `/http` folder.
When adding a new Protocol, add the GET Request here: `httpclient.service.ts`

## History

Not implemented yet. The idea is to have a Tab for each Lending&Borrowing Protocol where a graph of the offered APY 
for Stablecoins over the last couple days/weeks/months is displayed.