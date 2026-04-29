import { GoogleAuth } from "google-auth-library";

export default async function handler(req, res) {
  try {
    // Legge il JSON dalla variabile d'ambiente
 const serviceAccount = {
  type: "service_account",
  project_id: "gen-lang-client-0713384502",
  private_key: process.env.PRIVATE_KEY.replace(/\\\\n/g, "\n"),
  client_email: "chem-lab-backend@gen-lang-client-0713384502.iam.gserviceaccount.com",
  client_id: "105887244527573302",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/chem-lab-backend@gen-lang-client-0713384502.iam.gserviceaccount.com"
};

    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.token}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await r.json();
    return res.status(200).json(data);

  } catch (e) {
    console.error("Errore AI:", e);
    return res.status(500).json({ error: e.message });
  }
}
