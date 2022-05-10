const axios = require('axios');

let API_BASE_URL = process.env.MUON_API_URL

function setMuonApiUrl(url) {
  API_BASE_URL = url;
}

function callMuon(request) {
  return axios.post(API_BASE_URL, request).then(({data}) => data);
}

module.exports = {
  setMuonApiUrl,
  callMuon,
}
