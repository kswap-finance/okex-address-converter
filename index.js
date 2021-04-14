const _ = require('lodash');
const Buffer = require('buffer').Buffer 
const { bech32 } = require('bech32')
const BN = require('bn.js')
const Hash = require("eth-lib/lib/hash")

const SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

function buf2hex(buffer) { 
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

const isHexStrict = function (hex) {
  return ((_.isString(hex) || _.isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex));
}

const isBN = function (object) {
  return BN.isBN(object);
}

const sha3 = function (value) {
  if (isBN(value)) {
    value = value.toString();
  }

  if (isHexStrict(value) && /^0x/i.test((value).toString())) {
    value = hexToBytes(value);
  }

  let returnValue = Hash.keccak256(value); // jshint ignore:line

  if(returnValue === SHA3_NULL_S) {
    return null;
  } else {
    return returnValue;
  }
}

const decodeAddressToBuffer = (addr) => {
    const decodedAddress = bech32.decode(addr)
    return Buffer.from(bech32.fromWords(decodedAddress.words))
}

const toChecksumAddress = function (address) {
    if (typeof address === 'undefined') return '';
  
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address))
      throw new Error('Given address "'+ address +'" is not a valid Ethereum address.');
  
    address = address.toLowerCase().replace(/^0x/i,'');
    let addressHash = sha3(address).replace(/^0x/i,'');
    let checksumAddress = '0x';

    for (let i = 0; i < address.length; i++ ) {
      // If ith character is 8 to f then make it uppercase
      if (parseInt(addressHash[i], 16) > 7) {
        checksumAddress += address[i].toUpperCase();
      } else {
        checksumAddress += address[i];
      }
    }
    return checksumAddress;
}

const encodeAddressToBech32 = (hexAddr, prefix = "ex") => {
    hexAddr = hexAddr.slice(0, 2) === '0x' ? hexAddr.slice(2) : hexAddr
    const words = bech32.toWords(Buffer.from(hexAddr, "hex"))
    return bech32.encode(prefix, words)
  }

const convertBech32ToHex = (bech32Address) => {
    const address = decodeAddressToBuffer(bech32Address)
    const hexAddress = toChecksumAddress("0x"+buf2hex(address))
    return [hexAddress, encodeAddressToBech32(hexAddress.toLowerCase(), 'okexchain')]
}

const convertHexToBech32 = (hexAddress) => {
    return [encodeAddressToBech32(hexAddress.toLowerCase()), encodeAddressToBech32(hexAddress.toLowerCase(), 'okexchain')]
}

module.exports = {
  convertBech32ToHex,
  convertHexToBech32
}
