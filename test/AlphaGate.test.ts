import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { AlphaGate } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("AlphaGate Protocol Smart Contract", function () {
  let alphagate: AlphaGate;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    const AlphaGateFactory = await ethers.getContractFactory("AlphaGate");
    alphagate = (await AlphaGateFactory.deploy()) as AlphaGate;
    await alphagate.waitForDeployment();
  });

  describe("Alpha Wave Creation", function () {
    it("should successfully create a wave and emit EventCreated", async function () {
      const currentTime = await time.latest();
      const futureTime = currentTime + 86400; // 1 day in future
      const maxAttendees = 50;

      const tx = await alphagate.connect(user1).createEvent(
        "DeFi Vault Alpha Wave 1",
        "Exclusive early access for security testers on Botchain.",
        "https://alpha.example.fi/vault",
        futureTime,
        maxAttendees
      );

      await expect(tx)
        .to.emit(alphagate, "EventCreated")
        .withArgs(1, user1.address, "DeFi Vault Alpha Wave 1", futureTime, maxAttendees);

      const total = await alphagate.getTotalEventCount();
      expect(total).to.equal(1n);

      const eventRecord = await alphagate.getFunction("getEvent")(1);
      expect(eventRecord.id).to.equal(1n);
      expect(eventRecord.creator).to.equal(user1.address);
      expect(eventRecord.title).to.equal("DeFi Vault Alpha Wave 1");
      expect(eventRecord.description).to.equal("Exclusive early access for security testers on Botchain.");
      expect(eventRecord.location).to.equal("https://alpha.example.fi/vault");
      expect(eventRecord.eventDate).to.equal(futureTime);
      expect(eventRecord.maxAttendees).to.equal(maxAttendees);
      expect(eventRecord.totalAttendees).to.equal(0n);
      expect(eventRecord.status).to.equal(0); // Active
    });

    it("should reject creation with empty title", async function () {
      const futureTime = (await time.latest()) + 3600;
      await expect(
        alphagate.createEvent("", "Description", "Location", futureTime, 10)
      ).to.be.revertedWithCustomError(alphagate, "EmptyTitle");
    });

    it("should reject creation with empty description", async function () {
      const futureTime = (await time.latest()) + 3600;
      await expect(
        alphagate.createEvent("Title", "", "Location", futureTime, 10)
      ).to.be.revertedWithCustomError(alphagate, "EmptyDescription");
    });

    it("should reject creation with empty location", async function () {
      const futureTime = (await time.latest()) + 3600;
      await expect(
        alphagate.createEvent("Title", "Description", "", futureTime, 10)
      ).to.be.revertedWithCustomError(alphagate, "EmptyLocation");
    });

    it("should reject creation with past or current timestamp", async function () {
      const currentTime = await time.latest();
      await expect(
        alphagate.createEvent("Title", "Desc", "Loc", currentTime - 10, 10)
      ).to.be.revertedWithCustomError(alphagate, "PastEventDate");

      await expect(
        alphagate.createEvent("Title", "Desc", "Loc", currentTime, 10)
      ).to.be.revertedWithCustomError(alphagate, "PastEventDate");
    });

    it("should reject creation with zero max attendees", async function () {
      const futureTime = (await time.latest()) + 3600;
      await expect(
        alphagate.createEvent("Title", "Desc", "Loc", futureTime, 0)
      ).to.be.revertedWithCustomError(alphagate, "ZeroMaxAttendees");
    });
  });

  describe("Claiming Alpha Passes (RSVP)", function () {
    let eventId: number;
    let eventDate: number;

    beforeEach(async function () {
      eventDate = (await time.latest()) + 86400;
      await alphagate.connect(user1).createEvent("Wave 1", "Desc", "Loc", eventDate, 2);
      eventId = 1;
    });

    it("should allow a tester to claim a pass and emit EventRSVP", async function () {
      const tx = await alphagate.connect(user2).rsvp(eventId);

      await expect(tx)
        .to.emit(alphagate, "EventRSVP")
        .withArgs(eventId, user2.address, 1);

      expect(await alphagate.hasUserRSVPd(eventId, user2.address)).to.be.true;
      expect(await alphagate.getTotalAttendees(eventId)).to.equal(1n);

      const attendees = await alphagate.getEventAttendees(eventId);
      expect(attendees).to.deep.equal([user2.address]);

      const userRsvps = await alphagate.getEventsRSVPdByUser(user2.address);
      expect(userRsvps).to.deep.equal([1n]);
    });

    it("should prevent double pass claim from the same address", async function () {
      await alphagate.connect(user2).rsvp(eventId);
      await expect(
        alphagate.connect(user2).rsvp(eventId)
      ).to.be.revertedWithCustomError(alphagate, "AlreadyRSVPd");
    });

    it("should enforce capped capacity", async function () {
      await alphagate.connect(user2).rsvp(eventId);
      await alphagate.connect(user3).rsvp(eventId);

      await expect(
        alphagate.connect(owner).rsvp(eventId)
      ).to.be.revertedWithCustomError(alphagate, "EventIsFull");
    });

    it("should reject claim on non-existent wave", async function () {
      await expect(
        alphagate.connect(user2).rsvp(999)
      ).to.be.revertedWithCustomError(alphagate, "EventNotFound");

      await expect(
        alphagate.connect(user2).rsvp(0)
      ).to.be.revertedWithCustomError(alphagate, "EventNotFound");
    });

    it("should reject claim on closed wave", async function () {
      await alphagate.connect(user1).closeEvent(eventId);
      await expect(
        alphagate.connect(user2).rsvp(eventId)
      ).to.be.revertedWithCustomError(alphagate, "EventAlreadyClosed");
    });

    it("should reject claim if expiration time has passed", async function () {
      await time.increaseTo(eventDate + 1);
      await expect(
        alphagate.connect(user2).rsvp(eventId)
      ).to.be.revertedWithCustomError(alphagate, "EventHasPassed");
    });
  });

  describe("Surrendering Alpha Passes (Cancel RSVP)", function () {
    let eventId: number;

    beforeEach(async function () {
      const futureTime = (await time.latest()) + 86400;
      await alphagate.connect(user1).createEvent("Wave 1", "Desc", "Loc", futureTime, 5);
      eventId = 1;
      await alphagate.connect(user2).rsvp(eventId);
    });

    it("should allow a tester to surrender their pass and emit RSVPCancelled", async function () {
      const tx = await alphagate.connect(user2).cancelRSVP(eventId);

      await expect(tx)
        .to.emit(alphagate, "RSVPCancelled")
        .withArgs(eventId, user2.address, 0);

      expect(await alphagate.hasUserRSVPd(eventId, user2.address)).to.be.false;
      expect(await alphagate.getTotalAttendees(eventId)).to.equal(0n);

      const attendees = await alphagate.getEventAttendees(eventId);
      expect(attendees).to.deep.equal([]);

      const userRsvps = await alphagate.getEventsRSVPdByUser(user2.address);
      expect(userRsvps).to.deep.equal([]);
    });

    it("should reject surrender if user has not claimed a pass", async function () {
      await expect(
        alphagate.connect(user3).cancelRSVP(eventId)
      ).to.be.revertedWithCustomError(alphagate, "NotRSVPd");
    });
  });

  describe("Closing Waves", function () {
    let eventId: number;

    beforeEach(async function () {
      const futureTime = (await time.latest()) + 86400;
      await alphagate.connect(user1).createEvent("Wave 1", "Desc", "Loc", futureTime, 10);
      eventId = 1;
    });

    it("should allow creator to close wave and emit EventClosed", async function () {
      const tx = await alphagate.connect(user1).closeEvent(eventId);

      await expect(tx)
        .to.emit(alphagate, "EventClosed")
        .withArgs(eventId, user1.address);

      const eventRecord = await alphagate.getFunction("getEvent")(eventId);
      expect(eventRecord.status).to.equal(1); // Closed
    });

    it("should reject close by non-creator", async function () {
      await expect(
        alphagate.connect(user2).closeEvent(eventId)
      ).to.be.revertedWithCustomError(alphagate, "OnlyCreatorCanClose");
    });

    it("should reject closing an already closed wave", async function () {
      await alphagate.connect(user1).closeEvent(eventId);
      await expect(
        alphagate.connect(user1).closeEvent(eventId)
      ).to.be.revertedWithCustomError(alphagate, "EventAlreadyClosed");
    });
  });

  describe("Query & Batch View Functions", function () {
    it("should retrieve all events and creator events accurately", async function () {
      const futureTime = (await time.latest()) + 86400;
      await alphagate.connect(user1).createEvent("Wave A", "Desc A", "Loc A", futureTime, 10);
      await alphagate.connect(user2).createEvent("Wave B", "Desc B", "Loc B", futureTime + 100, 20);

      const allEvents = await alphagate.getAllEvents();
      expect(allEvents.length).to.equal(2);
      expect(allEvents[0].title).to.equal("Wave A");
      expect(allEvents[1].title).to.equal("Wave B");

      const user1Events = await alphagate.getEventsByCreator(user1.address);
      expect(user1Events).to.deep.equal([1n]);

      const user2Events = await alphagate.getEventsByCreator(user2.address);
      expect(user2Events).to.deep.equal([2n]);

      const allIds = await alphagate.getAllEventIds();
      expect(allIds).to.deep.equal([1n, 2n]);
    });
  });
});

