import admin from 'firebase-admin'

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    return admin.credential.cert(JSON.parse(json))
  }

  return admin.credential.applicationDefault()
}

function getAppOptions() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return { credential: getCredential() }
  }

  if (process.env.FIREBASE_PROJECT_ID) {
    return { projectId: process.env.FIREBASE_PROJECT_ID }
  }

  return { credential: getCredential() }
}

if (!admin.apps.length) {
  admin.initializeApp(getAppOptions())
}

export const firebaseAdmin = admin
