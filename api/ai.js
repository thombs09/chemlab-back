export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error: "Solo POST"});

  const body = req.body;

  try {
    console.log("Corpo ricevuto:", body); // 🔹 LOG per vedere il contenuto
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GEMINI_KEY}`
        },
        body: JSON.stringify(body)
      }
    );

    const data = await r.json();
    console.log("Risposta Gemini:", data); // 🔹 LOG per vedere l'output reale
    return res.status(200).json(data);
  } catch(e) {
    console.error("Errore AI:", e.message);
    return res.status(500).json({error: e.message});
  }
}
