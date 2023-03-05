// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Tanks is ERC721, ERC721Enumerable, AccessControl {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    string private baseURI;

    struct Tank {
        uint8 xp;
        uint8 health;
        uint8 defense;
        uint8 power;
        uint8 speed;
        bool initialized;
    }

    // Mapping to store Tank Parameters
    mapping(uint256 => Tank) public tankParams;

    // EVENTS
    event TankParamsUpdated(
        uint256 tankId,
        uint8 xp,
        uint8 health,
        uint8 defense,
        uint8 speed,
        uint8 power
    );
    event XPEarned(uint256 tankId, uint8 xp);

    // ERRORS
    error InvalidParams();

    constructor(
        address receiver,
        uint256 amount,
        address approveFor,
        string memory name,
        string memory symbol,
        string memory _baseURI,
        address _adminWallet
    ) ERC721(name, symbol) {
        mint(receiver, amount);

        _setApprovalForAll(receiver, approveFor, true);
        baseURI = _baseURI;
        _grantRole(ADMIN_ROLE, _adminWallet);
    }

    /**
     * @notice  Set parameters for a Tank
     * @dev     Can only be called by ADMIN
     *
     * @param _tankId   Tank ID
     * @param _xp       XP of the Tank
     * @param _health   Health of the Tank
     * @param _defense  Defense of the Tank
     * @param _speed    Speed of the Tank
     * @param _power    Power of the Tank
     */
    function setTankParams(
        uint256 _tankId,
        uint8 _xp,
        uint8 _health,
        uint8 _defense,
        uint8 _speed,
        uint8 _power
    ) external onlyRole(ADMIN_ROLE) {
        if (
            _xp > 10 ||
            _health > 100 ||
            _defense > 10 ||
            _speed > 10 ||
            _power > 10
        ) revert InvalidParams();
        tankParams[_tankId] = Tank(
            _xp,
            _health,
            _defense,
            _speed,
            _power,
            true
        );
        emit TankParamsUpdated(_tankId, _xp, _health, _defense, _speed, _power);
    }

    /**
     * @notice  Increment XP for a Tank
     * @dev     Can only be called by ADMIN
     *
     * @param _tankId   Tank ID
     */
    function incrementXP(uint256 _tankId) external onlyRole(ADMIN_ROLE) {
        tankParams[_tankId].xp += 1;
        emit XPEarned(_tankId, tankParams[_tankId].xp);
    }

    /**
     * @notice  Mint new Tanks
     *
     * @param receiver  Address of the receiver
     * @param amount    Amount of tokens to mint
     */
    function mint(address receiver, uint256 amount) public {
        for (uint256 i; i < amount; i++) {
            _tokenIds.increment();
            _mint(receiver, _tokenIds.current());
        }
    }

    /**
     * @notice  Get parameters for a Tank
     *
     * @param _tankId   Tank ID
     */
    function getTankParams(uint256 _tankId) public view returns (Tank memory) {
        return tankParams[_tankId];
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        _requireMinted(tokenId);

        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
