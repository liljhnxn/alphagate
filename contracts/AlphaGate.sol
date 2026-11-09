// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AlphaGate
 * @notice Decentralized On-Chain Whitelist & Closed Beta Testing Protocol on Botchain Testnet.
 * @dev Decentralized Alpha Access. Capped On-Chain Whitelists.
 */
contract AlphaGate {
    enum EventStatus {
        Active,
        Closed
    }

    struct EventRecord {
        uint256 id;
        address creator;
        string title;
        string description;
        string location;
        uint256 eventDate;
        uint256 maxAttendees;
        uint256 totalAttendees;
        uint256 createdAt;
        EventStatus status;
    }

    // Incremental counter for event / wave IDs
    uint256 private _eventCount;

    // Mapping from event ID to EventRecord
    mapping(uint256 => EventRecord) private _events;

    // Mapping from event ID => user address => bool (whether user has RSVP'd / claimed pass)
    mapping(uint256 => mapping(address => bool)) private _hasRSVPd;

    // Mapping from event ID => list of attendee / tester addresses
    mapping(uint256 => address[]) private _eventAttendees;

    // Mapping from creator address => list of created event IDs
    mapping(address => uint256[]) private _creatorEvents;

    // Mapping from attendee address => list of event IDs RSVP'd to
    mapping(address => uint256[]) private _userRSVPs;

    // Events
    event EventCreated(
        uint256 indexed eventId,
        address indexed creator,
        string title,
        uint256 eventDate,
        uint256 maxAttendees
    );

    event EventRSVP(
        uint256 indexed eventId,
        address indexed attendee,
        uint256 currentAttendees
    );

    event RSVPCancelled(
        uint256 indexed eventId,
        address indexed attendee,
        uint256 currentAttendees
    );

    event EventClosed(
        uint256 indexed eventId,
        address indexed creator
    );

    // Custom errors for clarity and gas efficiency
    error EmptyTitle();
    error EmptyDescription();
    error EmptyLocation();
    error PastEventDate();
    error ZeroMaxAttendees();
    error EventNotFound();
    error EventAlreadyClosed();
    error EventIsFull();
    error EventHasPassed();
    error AlreadyRSVPd();
    error NotRSVPd();
    error OnlyCreatorCanClose();

    /**
     * @notice Create a new alpha testing wave / whitelist campaign
     * @param title Title of the alpha wave
     * @param description Full wave / beta description
     * @param location Access gateway / build URL / staging environment
     * @param eventDate Expiration / launch Unix timestamp of the wave
     * @param maxAttendees Maximum capped tester slots (> 0)
     * @return eventId The newly generated unique wave ID
     */
    function createEvent(
        string calldata title,
        string calldata description,
        string calldata location,
        uint256 eventDate,
        uint256 maxAttendees
    ) external returns (uint256) {
        if (bytes(title).length == 0) revert EmptyTitle();
        if (bytes(description).length == 0) revert EmptyDescription();
        if (bytes(location).length == 0) revert EmptyLocation();
        if (eventDate <= block.timestamp) revert PastEventDate();
        if (maxAttendees == 0) revert ZeroMaxAttendees();

        _eventCount++;
        uint256 newEventId = _eventCount;

        _events[newEventId] = EventRecord({
            id: newEventId,
            creator: msg.sender,
            title: title,
            description: description,
            location: location,
            eventDate: eventDate,
            maxAttendees: maxAttendees,
            totalAttendees: 0,
            createdAt: block.timestamp,
            status: EventStatus.Active
        });

        _creatorEvents[msg.sender].push(newEventId);

        emit EventCreated(
            newEventId,
            msg.sender,
            title,
            eventDate,
            maxAttendees
        );

        return newEventId;
    }

    /**
     * @notice Claim an alpha access pass / whitelist slot
     * @param eventId The ID of the wave to join
     */
    function rsvp(uint256 eventId) external {
        if (eventId == 0 || eventId > _eventCount) revert EventNotFound();
        EventRecord storage eventItem = _events[eventId];

        if (eventItem.status == EventStatus.Closed) revert EventAlreadyClosed();
        if (eventItem.eventDate <= block.timestamp) revert EventHasPassed();
        if (eventItem.totalAttendees >= eventItem.maxAttendees) revert EventIsFull();
        if (_hasRSVPd[eventId][msg.sender]) revert AlreadyRSVPd();

        _hasRSVPd[eventId][msg.sender] = true;
        eventItem.totalAttendees++;
        _eventAttendees[eventId].push(msg.sender);
        _userRSVPs[msg.sender].push(eventId);

        emit EventRSVP(eventId, msg.sender, eventItem.totalAttendees);
    }

    /**
     * @notice Surrender / cancel an alpha access pass
     * @param eventId The ID of the wave to surrender slot from
     */
    function cancelRSVP(uint256 eventId) external {
        if (eventId == 0 || eventId > _eventCount) revert EventNotFound();
        if (!_hasRSVPd[eventId][msg.sender]) revert NotRSVPd();

        EventRecord storage eventItem = _events[eventId];
        _hasRSVPd[eventId][msg.sender] = false;

        if (eventItem.totalAttendees > 0) {
            eventItem.totalAttendees--;
        }

        // Remove from _eventAttendees
        address[] storage attendees = _eventAttendees[eventId];
        for (uint256 i = 0; i < attendees.length; i++) {
            if (attendees[i] == msg.sender) {
                attendees[i] = attendees[attendees.length - 1];
                attendees.pop();
                break;
            }
        }

        // Remove from _userRSVPs
        uint256[] storage rsvps = _userRSVPs[msg.sender];
        for (uint256 j = 0; j < rsvps.length; j++) {
            if (rsvps[j] == eventId) {
                rsvps[j] = rsvps[rsvps.length - 1];
                rsvps.pop();
                break;
            }
        }

        emit RSVPCancelled(eventId, msg.sender, eventItem.totalAttendees);
    }

    /**
     * @notice Close an alpha wave. Only the original creator can execute this.
     * @param eventId The ID of the wave to close
     */
    function closeEvent(uint256 eventId) external {
        if (eventId == 0 || eventId > _eventCount) revert EventNotFound();
        EventRecord storage eventItem = _events[eventId];

        if (msg.sender != eventItem.creator) revert OnlyCreatorCanClose();
        if (eventItem.status == EventStatus.Closed) revert EventAlreadyClosed();

        eventItem.status = EventStatus.Closed;

        emit EventClosed(eventId, msg.sender);
    }

    // --- VIEW / READ FUNCTIONS ---

    /**
     * @notice Returns the total count of created waves
     */
    function getTotalEventCount() external view returns (uint256) {
        return _eventCount;
    }

    /**
     * @notice Returns an array of all wave IDs from 1 to total count
     */
    function getAllEventIds() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](_eventCount);
        for (uint256 i = 0; i < _eventCount; i++) {
            ids[i] = i + 1;
        }
        return ids;
    }

    /**
     * @notice Returns the complete wave record by wave ID
     * @param eventId The wave ID to query
     */
    function getEvent(uint256 eventId) external view returns (EventRecord memory) {
        if (eventId == 0 || eventId > _eventCount) revert EventNotFound();
        return _events[eventId];
    }

    /**
     * @notice Alias for getEvent
     * @param eventId The wave ID to query
     */
    function getEventDetails(uint256 eventId) external view returns (EventRecord memory) {
        if (eventId == 0 || eventId > _eventCount) revert EventNotFound();
        return _events[eventId];
    }

    /**
     * @notice Returns all wave IDs created by a specific wallet
     * @param creator The wallet address of the wave creator
     */
    function getEventsByCreator(address creator) external view returns (uint256[] memory) {
        return _creatorEvents[creator];
    }

    /**
     * @notice Returns all wave IDs that a specific wallet has claimed pass for
     * @param user The wallet address of the tester
     */
    function getEventsRSVPdByUser(address user) external view returns (uint256[] memory) {
        return _userRSVPs[user];
    }

    /**
     * @notice Returns total current testers count for a wave
     * @param eventId The wave ID
     */
    function getTotalAttendees(uint256 eventId) external view returns (uint256) {
        if (eventId == 0 || eventId > _eventCount) revert EventNotFound();
        return _events[eventId].totalAttendees;
    }

    /**
     * @notice Checks whether a wallet address has active access pass for a wave
     * @param eventId The wave ID
     * @param user The wallet address
     */
    function hasUserRSVPd(uint256 eventId, address user) external view returns (bool) {
        return _hasRSVPd[eventId][user];
    }

    /**
     * @notice Returns the list of tester addresses for a wave
     * @param eventId The wave ID
     */
    function getEventAttendees(uint256 eventId) external view returns (address[] memory) {
        if (eventId == 0 || eventId > _eventCount) revert EventNotFound();
        return _eventAttendees[eventId];
    }

    /**
     * @notice Helper to fetch all waves in a single call for high frontend performance
     */
    function getAllEvents() external view returns (EventRecord[] memory) {
        EventRecord[] memory items = new EventRecord[](_eventCount);
        for (uint256 i = 0; i < _eventCount; i++) {
            items[i] = _events[i + 1];
        }
        return items;
    }
}

