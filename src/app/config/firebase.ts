import admin from "firebase-admin";

if (!process.env.FB_SERVICE_KEY) {
  console.warn("⚠ Firebase service key not found. Firebase auth disabled.");
} else {
  const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
    "utf8"
  );

  const serviceAccount = JSON.parse(decoded);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

export default admin;