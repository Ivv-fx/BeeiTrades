const crypto = require("node:crypto");

const PLAN_CATALOG = Object.freeze({
  monthly: Object.freeze({
    amount: 500000,
    currency: "INR",
    displayPrice: "₹5,000",
    period: "monthly",
    interval: 1,
    totalCount: 4,
    planIdParameter: "RAZORPAY_MONTHLY_PLAN_ID",
  }),
  quarterly: Object.freeze({
    amount: 1335000,
    currency: "INR",
    displayPrice: "₹13,350",
    period: "monthly",
    interval: 3,
    totalCount: 4,
    planIdParameter: "RAZORPAY_QUARTERLY_PLAN_ID",
  }),
});

function safeSignatureEqual(expected, provided) {
  if (typeof expected !== "string" || typeof provided !== "string" ||
      !/^[a-f\d]{64}$/i.test(provided)) return false;
  const expectedBytes = Buffer.from(expected, "hex");
  const providedBytes = Buffer.from(provided, "hex");
  return expectedBytes.length === providedBytes.length &&
    crypto.timingSafeEqual(expectedBytes, providedBytes);
}

function createSignature(secret, payload) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function verifySignature(secret, payload, signature) {
  return safeSignatureEqual(createSignature(secret, payload), signature);
}

function validatePlanDetails(plan, expected) {
  return Boolean(plan &&
    plan.item?.amount === expected.amount &&
    plan.item?.currency === expected.currency &&
    plan.period === expected.period &&
    plan.interval === expected.interval);
}

function subscriptionIdFromEvent(event) {
  const subscription = event.payload?.subscription?.entity;
  if (subscription?.id) return subscription.id;
  return event.payload?.payment?.entity?.subscription_id || null;
}

function transitionForEvent(eventName) {
  const statusByEvent = {
    "subscription.activated": "active",
    "subscription.charged": "active",
    "subscription.resumed": "active",
    "subscription.authenticated": "pending",
    "subscription.pending": "pending",
    "subscription.halted": "past_due",
    "payment.failed": "past_due",
    "subscription.cancelled": "cancelled",
    "subscription.completed": "completed",
    "subscription.paused": "paused",
  };
  return statusByEvent[eventName] || null;
}

module.exports = {
  PLAN_CATALOG,
  createSignature,
  safeSignatureEqual,
  subscriptionIdFromEvent,
  transitionForEvent,
  validatePlanDetails,
  verifySignature,
};
