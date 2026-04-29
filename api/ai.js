// api/ai.js
import { GoogleAuth } from "google-auth-library";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST permesso" });
  }

  try {
    // Inizializza GoogleAuth con il file JSON del service account
    const auth = new GoogleAuth({
      keyFile: "service-account.json", // Il file scaricato da Google Cloud
      scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    // Chiamata a Gemini 2.5 Flash
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.token}`, // Token OAuth 2
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (e) {
    console.error("Errore AI:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
