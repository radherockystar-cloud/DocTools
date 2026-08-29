export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const apiKey = process.env.SEGMIND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'SEGMIND_API_KEY is missing in Vercel Environment Variables.' 
      });
    }

    // Clean base64 prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Call Real AI CodeFormer Model on Segmind
    const segmindRes = await fetch('https://api.segmind.com/v1/codeformer', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Data,
        codeformer_fidelity: 0.75,
        background_enhance: true,
        face_upsample: true,
        upscale: 2
      })
    });

    if (!segmindRes.ok) {
      const errText = await segmindRes.text();
      return res.status(500).json({ success: false, error: 'AI Engine Error: ' + errText });
    }

    // Convert returned image buffer to clean base64 URL
    const buffer = await segmindRes.arrayBuffer();
    const outputBase64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;

    return res.status(200).json({ success: true, output: outputBase64 });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
