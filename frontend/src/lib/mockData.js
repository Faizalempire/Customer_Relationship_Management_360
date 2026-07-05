// Seed mock data for CRM360. Persisted to localStorage.

const STORAGE_KEY = "crm360_db_v1";

const seedUsers = [
  { id: "u1", name: "Aarav Sharma", email: "admin@crm360.com", password: "admin123", role: "admin", avatar: "AS", status: "active", phone: "+91 98765 43210", joined: "2024-06-10" },
  { id: "u2", name: "Priya Nair", email: "manager@crm360.com", password: "manager123", role: "manager", avatar: "PN", status: "active", phone: "+91 98111 22233", joined: "2024-08-15" },
  { id: "u3", name: "Rohan Verma", email: "exec@crm360.com", password: "exec123", role: "executive", avatar: "RV", status: "active", phone: "+91 90000 11122", joined: "2024-11-02" },
  { id: "u4", name: "Sneha Kapoor", email: "sneha@crm360.com", password: "exec123", role: "executive", avatar: "SK", status: "active", phone: "+91 99000 55511", joined: "2025-01-10" },
  { id: "u5", name: "Aditya Singh", email: "aditya@crm360.com", password: "exec123", role: "executive", avatar: "AD", status: "inactive", phone: "+91 91100 22200", joined: "2025-02-20" },
];

const stages = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

const seedCustomers = [
  { id: "c1", name: "Orion Retailers", contact: "Kavya Iyer", email: "kavya@orionretail.com", phone: "+91 90000 11111", value: 450000, status: "active", assignedTo: "u3", tags: ["Enterprise", "Retail"], notes: "Renewal in Q2. High potential upsell.", created: "2025-05-14" },
  { id: "c2", name: "Nova Technologies", contact: "Manish Gupta", email: "manish@novatech.io", phone: "+91 99999 22222", value: 780000, status: "active", assignedTo: "u4", tags: ["SaaS", "Tier-1"], notes: "Onboarded successfully. NPS 9.", created: "2025-04-02" },
  { id: "c3", name: "Vista Foods", contact: "Anjali Rao", email: "anjali@vistafoods.com", phone: "+91 90090 90090", value: 220000, status: "churn-risk", assignedTo: "u3", tags: ["FMCG"], notes: "Complained about pricing.", created: "2025-03-20" },
  { id: "c4", name: "Zenith Consulting", contact: "Farah Khan", email: "farah@zenith.co", phone: "+91 92120 33322", value: 1200000, status: "active", assignedTo: "u4", tags: ["Enterprise", "Consulting"], notes: "Very engaged. Champion identified.", created: "2025-02-11" },
  { id: "c5", name: "Blue Harbor Logistics", contact: "Naveen Kumar", email: "naveen@blueharbor.in", phone: "+91 93000 44004", value: 340000, status: "active", assignedTo: "u3", tags: ["Logistics"], notes: "Contract signed for 12 months.", created: "2025-01-25" },
];

const seedLeads = [
  { id: "l1", name: "Kartik Enterprises", contact: "Kartik Bhatia", email: "kartik@ke.co", phone: "+91 90111 22233", source: "Website", value: 320000, stage: "New", assignedTo: "u3", priority: "high", notes: "Wants demo next week.", created: "2026-01-18" },
  { id: "l2", name: "Silverline Realty", contact: "Meera Joshi", email: "meera@silverline.in", phone: "+91 98776 55443", source: "Referral", value: 680000, stage: "Contacted", assignedTo: "u4", priority: "high", notes: "Referred by Orion.", created: "2026-01-15" },
  { id: "l3", name: "Peak Pharma", contact: "Suresh Menon", email: "suresh@peakpharma.com", phone: "+91 90000 55511", source: "Cold Email", value: 210000, stage: "Qualified", assignedTo: "u3", priority: "medium", notes: "Budget confirmed.", created: "2026-01-10" },
  { id: "l4", name: "Aurora Media", contact: "Riya Sen", email: "riya@auroramedia.tv", phone: "+91 91111 22221", source: "LinkedIn", value: 520000, stage: "Proposal", assignedTo: "u4", priority: "high", notes: "Proposal sent. Awaiting review.", created: "2026-01-06" },
  { id: "l5", name: "Titan Freight", contact: "Deepak Rao", email: "deepak@titanfreight.co", phone: "+91 92202 33344", source: "Event", value: 900000, stage: "Negotiation", assignedTo: "u3", priority: "high", notes: "Discount request pending approval.", created: "2025-12-28" },
  { id: "l6", name: "Ember Foods", contact: "Isha Patel", email: "isha@emberfoods.com", phone: "+91 93030 40404", source: "Website", value: 150000, stage: "Won", assignedTo: "u4", priority: "medium", notes: "Signed deal!", created: "2025-12-20" },
  { id: "l7", name: "Cascade Studios", contact: "Nikhil Ray", email: "nikhil@cascadestudios.io", phone: "+91 90101 20303", source: "Referral", value: 400000, stage: "Lost", assignedTo: "u3", priority: "low", notes: "Chose competitor.", created: "2025-12-14" },
  { id: "l8", name: "Verdant Farms", contact: "Anushka D.", email: "anushka@verdantfarms.in", phone: "+91 90404 50505", source: "Website", value: 180000, stage: "New", assignedTo: "u4", priority: "medium", notes: "Inbound from pricing page.", created: "2026-01-20" },
  { id: "l9", name: "Solstice Bank", contact: "Vikram Anand", email: "vikram@solsticebank.com", phone: "+91 90505 60606", source: "LinkedIn", value: 1500000, stage: "Contacted", assignedTo: "u3", priority: "high", notes: "Multiple stakeholders identified.", created: "2026-01-19" },
];

const seedTasks = [
  { id: "t1", title: "Follow up with Kartik Enterprises", description: "Send updated pricing sheet", assignedTo: "u3", assignedBy: "u2", dueDate: "2026-02-05", priority: "high", status: "pending", relatedTo: "l1" },
  { id: "t2", title: "Prepare proposal for Aurora Media", description: "3-year enterprise plan", assignedTo: "u4", assignedBy: "u2", dueDate: "2026-02-03", priority: "high", status: "in-progress", relatedTo: "l4" },
  { id: "t3", title: "Quarterly review call - Nova Tech", description: "QBR agenda + metrics", assignedTo: "u4", assignedBy: "u1", dueDate: "2026-02-10", priority: "medium", status: "pending", relatedTo: "c2" },
  { id: "t4", title: "Update CRM with new touchpoints", description: "Log all interactions from Jan", assignedTo: "u3", assignedBy: "u2", dueDate: "2026-01-30", priority: "low", status: "completed", relatedTo: null },
  { id: "t5", title: "Send onboarding docs to Blue Harbor", description: "PDF + kickoff invite", assignedTo: "u3", assignedBy: "u2", dueDate: "2026-01-28", priority: "medium", status: "overdue", relatedTo: "c5" },
];

const seedFollowUps = [
  { id: "f1", customerId: "c1", leadId: null, title: "Renewal discussion - Orion", date: "2026-02-04T11:00", status: "scheduled", assignedTo: "u3", notes: "Discuss renewal terms" },
  { id: "f2", customerId: null, leadId: "l2", title: "Silverline demo", date: "2026-02-02T15:30", status: "scheduled", assignedTo: "u4", notes: "Live demo of pipeline" },
  { id: "f3", customerId: null, leadId: "l5", title: "Titan Freight - Contract sign", date: "2026-01-29T10:00", status: "overdue", assignedTo: "u3", notes: "Need signature" },
  { id: "f4", customerId: "c4", leadId: null, title: "Zenith QBR", date: "2026-02-12T14:00", status: "scheduled", assignedTo: "u4", notes: "Quarterly business review" },
  { id: "f5", customerId: null, leadId: "l1", title: "Kartik onboarding call", date: "2026-02-01T10:30", status: "completed", assignedTo: "u3", notes: "Onboarded" },
];

const seedNotifications = [
  { id: "n1", userId: "u3", title: "New lead assigned", message: "Kartik Enterprises has been assigned to you", type: "lead", read: false, created: "2026-01-28T09:12" },
  { id: "n2", userId: "u3", title: "Task overdue", message: "Send onboarding docs to Blue Harbor", type: "task", read: false, created: "2026-01-29T08:00" },
  { id: "n3", userId: "u2", title: "Lead won!", message: "Ember Foods deal marked as Won", type: "success", read: true, created: "2025-12-20T17:33" },
  { id: "n4", userId: "u1", title: "New user signed up", message: "Sneha Kapoor joined as Executive", type: "user", read: true, created: "2025-01-10T10:00" },
  { id: "n5", userId: "u2", title: "Follow-up overdue", message: "Titan Freight follow-up missed", type: "warning", read: false, created: "2026-01-29T11:00" },
];

const seedActivity = [
  { id: "a1", userId: "u2", action: "created", entity: "lead", entityId: "l9", description: "Created lead 'Solstice Bank'", timestamp: "2026-01-19T14:22" },
  { id: "a2", userId: "u3", action: "updated", entity: "lead", entityId: "l3", description: "Moved lead 'Peak Pharma' to Qualified", timestamp: "2026-01-16T10:14" },
  { id: "a3", userId: "u4", action: "won", entity: "lead", entityId: "l6", description: "Marked 'Ember Foods' as Won", timestamp: "2025-12-20T17:32" },
  { id: "a4", userId: "u1", action: "created", entity: "user", entityId: "u4", description: "Added new user 'Sneha Kapoor'", timestamp: "2025-01-10T10:00" },
  { id: "a5", userId: "u2", action: "assigned", entity: "task", entityId: "t2", description: "Assigned task to Sneha Kapoor", timestamp: "2026-01-25T09:12" },
  { id: "a6", userId: "u3", action: "completed", entity: "task", entityId: "t4", description: "Completed task 'Update CRM'", timestamp: "2026-01-27T18:45" },
];

const initialData = {
  users: seedUsers,
  customers: seedCustomers,
  leads: seedLeads,
  tasks: seedTasks,
  followups: seedFollowUps,
  notifications: seedNotifications,
  activity: seedActivity,
  stages,
};

export function getDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  try { return JSON.parse(raw); } catch { return initialData; }
}

export function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDB() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
}

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export const STAGES = stages;
