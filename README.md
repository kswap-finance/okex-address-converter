# okex-address-converter 

Thanks to [exchain-javascript-sdk](https://github.com/okex/exchain-javascript-sdk/blob/master/LICENSE)

## How to use

```javascript
const crypto = require('./index.js')

// let bech32Address = "ex1ya7dn2rr8nx07tx9ksq8gvz5utvarrh0knjnjn"
let bech32Address = "okexchain1ya7dn2rr8nx07tx9ksq8gvz5utvarrh03cen3l"
let newHexAddress = crypto.convertBech32ToHex(bech32Address)
console.log('newHexAddress', newHexAddress)

let hexAddress = '0x277CD9a8633ccCFF2Cc5B400743054e2d9d18eEf';
let newBechAddress = crypto.convertHexToBech32(hexAddress);
console.log('newBechAddress', newBechAddress);
```