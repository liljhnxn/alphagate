export const ALPHAGATE_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  "0xE9cD49688af28A3DA5A33e30EcEe2D4A581B47BA";

export const GATHERLY_CONTRACT_ADDRESS = ALPHAGATE_CONTRACT_ADDRESS;

export enum EventStatus {
  Active = 0,
  Closed = 1,
}

export interface EventRecord {
  id: bigint;
  creator: `0x${string}`;
  title: string;
  description: string;
  location: string;
  eventDate: bigint;
  maxAttendees: bigint;
  totalAttendees: bigint;
  createdAt: bigint;
  status: EventStatus;
}

export const ALPHAGATE_ABI = [
  {
    type: "function",
    name: "createEvent",
    inputs: [
      { name: "title", type: "string", internalType: "string" },
      { name: "description", type: "string", internalType: "string" },
      { name: "location", type: "string", internalType: "string" },
      { name: "eventDate", type: "uint256", internalType: "uint256" },
      { name: "maxAttendees", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rsvp",
    inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelRSVP",
    inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "closeEvent",
    inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getTotalEventCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllEventIds",
    inputs: [],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEvent",
    inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Gatherly.EventRecord",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "creator", type: "address", internalType: "address" },
          { name: "title", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
          { name: "location", type: "string", internalType: "string" },
          { name: "eventDate", type: "uint256", internalType: "uint256" },
          { name: "maxAttendees", type: "uint256", internalType: "uint256" },
          { name: "totalAttendees", type: "uint256", internalType: "uint256" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "status", type: "uint8", internalType: "enum Gatherly.EventStatus" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEventDetails",
    inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Gatherly.EventRecord",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "creator", type: "address", internalType: "address" },
          { name: "title", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
          { name: "location", type: "string", internalType: "string" },
          { name: "eventDate", type: "uint256", internalType: "uint256" },
          { name: "maxAttendees", type: "uint256", internalType: "uint256" },
          { name: "totalAttendees", type: "uint256", internalType: "uint256" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "status", type: "uint8", internalType: "enum Gatherly.EventStatus" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllEvents",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct Gatherly.EventRecord[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "creator", type: "address", internalType: "address" },
          { name: "title", type: "string", internalType: "string" },
          { name: "description", type: "string", internalType: "string" },
          { name: "location", type: "string", internalType: "string" },
          { name: "eventDate", type: "uint256", internalType: "uint256" },
          { name: "maxAttendees", type: "uint256", internalType: "uint256" },
          { name: "totalAttendees", type: "uint256", internalType: "uint256" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "status", type: "uint8", internalType: "enum Gatherly.EventStatus" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEventsByCreator",
    inputs: [{ name: "creator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEventsRSVPdByUser",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalAttendees",
    inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasUserRSVPd",
    inputs: [
      { name: "eventId", type: "uint256", internalType: "uint256" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEventAttendees",
    inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "EventCreated",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "creator", type: "address", indexed: true, internalType: "address" },
      { name: "title", type: "string", indexed: false, internalType: "string" },
      { name: "eventDate", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "maxAttendees", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EventRSVP",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "attendee", type: "address", indexed: true, internalType: "address" },
      { name: "currentAttendees", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RSVPCancelled",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "attendee", type: "address", indexed: true, internalType: "address" },
      { name: "currentAttendees", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EventClosed",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "creator", type: "address", indexed: true, internalType: "address" },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "EmptyTitle",
    inputs: [],
  },
  {
    type: "error",
    name: "EmptyDescription",
    inputs: [],
  },
  {
    type: "error",
    name: "EmptyLocation",
    inputs: [],
  },
  {
    type: "error",
    name: "PastEventDate",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroMaxAttendees",
    inputs: [],
  },
  {
    type: "error",
    name: "EventNotFound",
    inputs: [],
  },
  {
    type: "error",
    name: "EventAlreadyClosed",
    inputs: [],
  },
  {
    type: "error",
    name: "EventIsFull",
    inputs: [],
  },
  {
    type: "error",
    name: "EventHasPassed",
    inputs: [],
  },
  {
    type: "error",
    name: "AlreadyRSVPd",
    inputs: [],
  },
  {
    type: "error",
    name: "NotRSVPd",
    inputs: [],
  },
  {
    type: "error",
    name: "OnlyCreatorCanClose",
    inputs: [],
  },
] as const;

export const GATHERLY_ABI = ALPHAGATE_ABI;
