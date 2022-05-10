const { tronWeb, encodeParams } = require('./utils/tronweb');
const { callMuon } = require('./utils/muon')

const CONTRACT_ADDRESS = process.env.SAMPLE_CONTRACT_ADDRESS

async function testVerifyString(str) {
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
  let contractCallResult = await contract.verify_string(
    // _str
    result,
    // msg hash
    "0x" + cid.substr(1),
    // signatures
    [signature],
    // owners
    [owner],
    // nonces
    [nonceAddress]
  )
    .send({shouldPollResponse:true});
  console.dir(contractCallResult, {depth: null})
}

async function testVerifyStringInt(str, int) {
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
  let contractCallResult = await contract.verify_string_int(
    // _str
    result.str,
    result.int,
    // msg hash
    "0x" + cid.substr(1),
    // signatures
    [signature],
    // owners
    [owner],
    // nonces
    [nonceAddress]
  )
    .send({shouldPollResponse:true});
  console.dir(contractCallResult, {depth: null})
}

async function testVerifyStringIntAddress(str, int, address) {
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

  let params = "0x" + await encodeParams([
    {type: "string", value: str},
    {type: "uint256", value: int},
    {type: "address", value: address},
  ])

  console.log({
    result, nonceAddress, owner, signature, cid,
    packedParams: params
  })

  let contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
  let contractCallResult = await contract.verify_string_int_address(
    // packed params
    params,
    // msg hash
    "0x" + cid.substr(1),
    // signatures
    [signature],
    // owners
    [owner],
    // nonces
    [nonceAddress]
  )
    .send({shouldPollResponse:true});
  console.dir(contractCallResult, {depth: null})
}

async function test() {
  console.log(`test scenario 1`)
  await testVerifyString("sample-string-1")

  console.log(`test scenario 2`)
  await testVerifyStringInt("sample-string-2", "0x41")

  console.log(`test scenario 3`)
  await testVerifyStringIntAddress("sample-string-3", "0x42", "0x829bd824b016326a401d083b33d092293333a830")
}

test();
