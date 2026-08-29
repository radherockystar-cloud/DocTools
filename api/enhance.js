export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { image, scale = 2, face_enhance = false } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }

    const replicateApiToken = process.env.REPLICATE_API_TOKEN;

    if (!replicateApiToken) {
      return res.status(500).json({
        success: false,
        error: 'REPLICATE_API_TOKEN is missing in Vercel Environment Variables.'
      });
    }

    // Call Official Model endpoint with Prefer: wait (Instant Sync Mode)
    const response = await fetch('https://api.replicate.com/v1/models/nightmareai/real-esrgan/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken.trim()}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({
        input: {
          image: image,
          scale: Number(scale),
          face_enhance: Boolean(face_enhance)
        }
      })
    });

    let prediction = await response.json();

    if (response.status !== 200 && response.status !== 201) {
      return res.status(500).json({
        success: false,
        error: prediction.detail || prediction.error || 'Failed to start AI task'
      });
    }

    // If still running (rare fallback), poll until completed
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Bearer ${replicateApiToken.trim()}` }
      });
      prediction = await pollRes.json();
    }

    if (prediction.status === 'succeeded' && prediction.output) {
      return res.status(200).json({ success: true, output: prediction.output });
    } else {
      return res.status(500).json({ success: false, error: prediction.error || 'AI enhancement failed' });
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
