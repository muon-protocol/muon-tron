const { tronWeb, encodeSignature, toEthAddress } = require('./utils/tron');
const { callMuon } = require('./utils/muon')

const CONTRACT_ADDRESS = process.env.SAMPLE_CONTRACT_ADDRESS

async function testVerifyString(str) {
  console.log(`calling muon ...`)
  let muonResponse = await callMuon({
    app: "tron-sample",
    method: "verify_string",
    params: {str}
  });
  // console.dir(muonResponse, {depth: null});
  let {
    success,
    result: {
      data: {result, init: {nonceAddress}},
      signatures:{0:{owner, signature}},
      cid
    }
  } = muonResponse

  console.log({result, nonceAddress, owner, signature, cid})

  let contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
  console.log(`calling sample smart contract ...`)
  let contractCallResult = await contract.verify_string(
    // _str
    result,
    // msg hash
    "0x" + cid.substr(1),
    // signatures
    [encodeSignature(signature, owner, nonceAddress)]
  )
    .send({shouldPollResponse:true});
  console.dir(contractCallResult, {depth: null})
}

async function testVerifyStringInt(str, int) {
  console.log(`calling muon ...`)
  let muonResponse = await callMuon({
    app: "tron-sample",
    method: "verify_string_int",
    params: {str, int}
  });
  // console.dir(muonResponse, {depth: null});
  let {
    success,
    result: {
      data: {result, init: {nonceAddress}},
      signatures:{0:{owner, signature}},
      cid
    }
  } = muonResponse

  console.log({result, nonceAddress, owner, signature, cid})

  let contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
  console.log(`calling sample smart contract ...`)
  let contractCallResult = await contract.verify_string_int(
    // _str
    result.str,
    result.int,
    // msg hash
    "0x" + cid.substr(1),
    // signatures
    [encodeSignature(signature, owner, nonceAddress)]
  )
    .send({shouldPollResponse:true});
  console.dir(contractCallResult, {depth: null})
}

async function testVerifyStringIntAddress(str, int, address) {
  console.log(`calling muon ...`)
  let muonResponse = await callMuon({
    app: "tron-sample",
    method: "verify_string_int_address",
    params: {str, int, address}
  });
  // console.dir(muonResponse, {depth: null});
  let {
    success,
    result: {
      data: {result, init: {nonceAddress}},
      signatures:{0:{owner, signature}},
      cid
    }
  } = muonResponse


  console.log({
    result, nonceAddress, owner, signature, cid
  })

  let contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
  console.log(`calling sample smart contract ...`)
  let contractCallResult = await contract.verify_string_int_address(
    // packed params
    str,
    int,
    address,
    // msg hash
    "0x" + cid.substr(1),
    // signatures
    [encodeSignature(signature, owner, nonceAddress)]
  )
    .send({shouldPollResponse:true});
  console.dir(contractCallResult, {depth: null})
}

async function test() {
  console.log(`test scenario 1`)
  try {
    await testVerifyString("sample-string-1")
  }catch (e) {
    console.error(e)
  }

  console.log(`test scenario 2`)
  try {
    await testVerifyStringInt("sample-string-2", "0x41")
  }catch (e) {
    console.error(e)
  }

  console.log(`test scenario 3`)
  try {
    await testVerifyStringIntAddress("sample-string-3", "0x42", process.env.SAMPLE_CONTRACT_ADDRESS)
  }catch (e) {
    console.error(e)
  }

  console.log(`test scenario 4`)
  try {
    await testVerifyStringIntAddress("sample-string-4", "0x42", toEthAddress(process.env.SAMPLE_CONTRACT_ADDRESS))
  }catch (e) {
    console.error(e)
  }
}

test();
