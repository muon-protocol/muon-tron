const { tronWeb, soliditySha3 } = require('./utils/tronweb');
const {callMuon} = require('./utils/muon');

/**
 * SchnorrSECP256K1: https://shasta.tronscan.org/?#/contract/TEmemHSd3RNZqL9AmYe5xdgskapfBui42m/code
 * MuonV02: https://shasta.tronscan.org/?#/contract/TCtHhEtuh3QKh5a9zyf4YTAdgS5xaaV2D7/code
 */

async function run() {
  console.log(`calling muon ...`)
  let muonResponse = await callMuon({app: 'tss', method: 'test'});  let {
    success,
    result: {
      data: {result: appResult, init: {nonceAddress}},
      signatures:{0:{owner, signature}},
      cid
    }
  } = muonResponse

  console.log({appResult, owner, signature, nonceAddress, cid})

  let muonContract = await tronWeb.contract().at("TCtHhEtuh3QKh5a9zyf4YTAdgS5xaaV2D7");

  console.log(`calling muon smart contract ...`)
  let verifyResult = await muonContract.verify(
    // requestID
    `0x${cid.substr(1)}`,
    // msg hash
    soliditySha3(appResult),
    // signatures
    [signature],
    // owners
    [owner],
    // nonces
    [nonceAddress]
  )
    .send({shouldPollResponse: true});

  console.dir(verifyResult, {depth: null})
}

run();
