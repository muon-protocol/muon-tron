
// SPDX-License-Identifier: GPL-3.0

pragma abicoder v2;
pragma solidity >=0.7.0 <0.9.0;

interface IMuonV02 {

    struct SchnorrSign {
        uint256 signature;
        uint256 owner;
        address nonce;
    }

    function verify(
        bytes calldata reqId,
        uint256 hash,
        uint256[] calldata _sigs,
        uint256[] calldata _owners,
        address[] calldata _nonces
    ) external returns (bool);
}
