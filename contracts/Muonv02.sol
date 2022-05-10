// SPDX-License-Identifier: MIT

pragma abicoder v2;
pragma solidity ^0.7.0;

import "./Ownable.sol";
import "./SchnorrSECP256K1.sol";

contract MuonV02 is Ownable {

    event Transaction(bytes reqId, uint256[] groups);

    SchnorrSECP256K1 schnorr;

    struct PublicKey {
        uint256 x;
        uint8 parity;
    }

    struct SchnorrSign {
        uint256 signature;
        uint256 owner;
        address nonce;
    }

    mapping(uint256 => PublicKey) public groupsPubKey;

    constructor(address _schnorrLib, uint256 _groupAddress, uint256 _groupPubKeyX, uint8 _groupPubKeyYParity){
        schnorr = SchnorrSECP256K1(_schnorrLib);
        addGroupPublicKey(_groupAddress, _groupPubKeyX, _groupPubKeyYParity);
    }

    function verify(bytes calldata _reqId, uint256 _hash, uint256[] calldata _sigs, uint256[] calldata _owners, address[] calldata _nonces) public returns (bool)
    {
        require(_sigs.length > 0, '!_sigs');
        require(_sigs.length == _owners.length, '_owners length mismatch');
        require(_sigs.length == _nonces.length, '_nonces.length mismatch');

        PublicKey memory pub;
        uint256[] memory groups = new uint256[](_sigs.length);
        for(uint i=0 ; i<_sigs.length; i++){
            pub = groupsPubKey[_owners[i]];
            if(pub.x == 0)
                return false;
            if(!schnorr.verifySignature(pub.x, pub.parity, _sigs[i], _hash, _nonces[i]) || (i>0 && _owners[i] <= groups[i-1]))
                return false;
            groups[i] = _owners[i];
        }
        emit Transaction(_reqId, groups);
        return true;
    }

    function addGroupPublicKey(uint256 _address, uint256 _pubX, uint8 _pubYParity) public onlyOwner {
        schnorr.validatePubKey(_pubX);
        groupsPubKey[_address] = PublicKey(_pubX, _pubYParity);
    }

    function removeGroupPublicKey(uint256 _groupAddress) public onlyOwner {
        delete groupsPubKey[_groupAddress];
    }

    function setLibAddress(address _schnorrLib) public onlyOwner {
        schnorr = SchnorrSECP256K1(_schnorrLib);
    }
}
