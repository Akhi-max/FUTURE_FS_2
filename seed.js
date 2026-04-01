/**
 * Seed script — populates the database with sample leads.
 * Run with:  node seed.js
 * (from the /server directory, after npm install)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Lead = require("./models/Lead");

const SAMPLE_LEADS = [
  { name: "Alice Johnson", email: "alice@example.com", phone: "+1 555 100 1001", source: "Website", status: "new", notes: [{ text: "Came from the contact form, interested in enterprise plan." }] },
  { name: "Bob Martinez", email: "bob@techcorp.io", phone: "+1 555 100 1002", source: "Referral", status: "contacted", notes: [{ text: "Referred by Alice. Had a 30-min intro call on Monday." }] },
  { name: "Carol White", email: "carol.w@startup.co", phone: "+1 555 100 1003", source: "LinkedIn", status: "converted", notes: [{ text: "Signed the contract. Onboarding scheduled for next week." }] },
  { name: "David Lee", email: "dlee@bigco.com", phone: "+1 555 100 1004", source: "Cold Email", status: "lost", notes: [{ text: "Budget frozen for Q3. Follow up in October." }] },
  { name: "Eva Chen", email: "eva@designstudio.com", phone: "+1 555 100 1005", source: "Website", status: "new" },
  { name: "Frank Nguyen", email: "frank@agency.net", phone: "+1 555 100 1006", source: "Event", status: "contacted", notes: [{ text: "Met at SaaS Summit 2024. Very interested in the analytics module." }] },
  { name: "Grace Kim", email: "grace@ecomm.shop", phone: "+1 555 100 1007", source: "Referral", status: "converted" },
  { name: "Henry Brown", email: "hbrown@lawfirm.com", phone: "+1 555 100 1008", source: "Google Ads", status: "new" },
  { name: "Isabelle Russo", email: "irusso@media.com", phone: "+1 555 100 1009", source: "LinkedIn", status: "contacted" },
  { name: "Jake Torres", email: "jake@freelance.dev", phone: "+1 555 100 1010", source: "Website", status: "lost", notes: [{ text: "Went with a competitor. Cheaper pricing." }] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const existing = await Lead.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️  ${existing} leads already exist. Skipping seed.`);
    console.log("   To re-seed, drop the 'leads' collection first.");
    await mongoose.disconnect();
    return;
  }

  await Lead.insertMany(SAMPLE_LEADS);
  console.log(`✅ Seeded ${SAMPLE_LEADS.length} sample leads.`);
  await mongoose.disconnect();
  console.log("👋 Done!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
