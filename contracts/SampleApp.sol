// SPDX-License-Identifier: MIT

pragma abicoder v2;
pragma solidity ^0.7.0;

import "./Ownable.sol";
import "./IMuonV02.sol";

contract SampleApp is Ownable {

    event VerifyString(string str);
    event VerifyStringInt(string str, uint256 num);
    event VerifyStringIntAddress(string str, uint256 num, address addr);
    event VerifyParams(bytes params);

    uint32 public constant APP_ID = 5007;
    IMuonV02 public muon;

    function verify_string(
        string calldata _str,
        bytes calldata _reqId,
        bytes[] calldata _sigs
    ) public returns (bool) {

        bytes32 hash = keccak256(abi.encodePacked(APP_ID, _str));

        require(muon.verify(_reqId, uint256(hash), decodeSigs(_sigs)), '!verified');

        emit VerifyString(_str);

        return true;
    }

    function verify_string_int(
        string calldata _str,
        uint256 _num,
        bytes calldata _reqId,
        bytes[] calldata _sigs
    ) public returns (bool) {

        bytes32 hash = keccak256(abi.encodePacked(APP_ID, _str, _num));

        require(muon.verify(_reqId, uint256(hash), decodeSigs(_sigs)), '!verified');

        emit VerifyStringInt(_str, _num);

        return true;
    }

    function verify_string_int_address(
        string calldata _str,
        uint256 _int,
        address _addr,
        bytes calldata _reqId,
        bytes[] calldata _sigs
    ) public returns (bool) {

        bytes32 hash = keccak256(abi.encodePacked(APP_ID, _str, _int, _addr));

        require(muon.verify(_reqId, uint256(hash), decodeSigs(_sigs)), '!verified');

        emit VerifyStringIntAddress(_str, _int, _addr);

        return true;
    }

    constructor(address _muon){
        setMuonAddress(_muon);
    }

    function setMuonAddress(address _muon) public onlyOwner {
        muon = IMuonV02(_muon);
    }

    function decodeSigs(bytes[] calldata _sigs) internal pure returns (IMuonV02.SchnorrSign[] memory) {
        IMuonV02.SchnorrSign[] memory sigs = new IMuonV02.SchnorrSign[](_sigs.length);
        for(uint i=0 ; i<_sigs.length ; i++) {
            (uint256 signature, address owner, address nonce) = abi.decode(_sigs[i], (uint256, address, address));
            sigs[i] = IMuonV02.SchnorrSign(signature, owner, nonce);
        }
        return sigs;
    }
}
