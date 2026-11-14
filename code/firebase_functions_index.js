// OPTIONAL extension - Firebase Cloud Functions (Node.js). Not required for Tasks 4-5.
// Deploy with: firebase deploy --only functions
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.database();

// Runs whenever the ESP32 logs a new reading.
exports.processSensorData = functions.database
  .ref("/sensorData/{pushId}")
  .onCreate(async (snapshot) => {
    const data = snapshot.val();
    if (data.temperature > 40) {
      console.log("Temperature alert:", data.temperature);
      // hook for a notification (email, push, ...)
    }
    return null;
  });

// Audit trail: remember every change of the bulb state.
exports.logBulbCommand = functions.database
  .ref("/appliances/bulbState")
  .onUpdate(async (change) => {
    const before = change.before.val();
    const after = change.after.val();
    if (before === after) return null;
    return db.ref("/auditLog").push({
      command: "bulbState",
      newValue: after,
      timestamp: admin.database.ServerValue.TIMESTAMP,
    });
  });
