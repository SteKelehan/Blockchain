// installing a lib to gen a key and signiture and it can also verifiy a sig
// EC - eleiptic curve
const EC = require('elliptic').ec

// this is the ec of the bitcoin wallet
const ec = new EC('secp256k1')
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

console.log();
console.log('Priv Key: ', privateKey);
console.log();
console.log('Pub Key: ', publicKey);