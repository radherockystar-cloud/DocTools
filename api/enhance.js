export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Replicate API token missing in .env.local' });
  }

  try {
    const { image, scale = 2, face_enhance = true } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Call Replicate Real-ESRGAN Model
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "f121d5f5f8def9967f72f67c8211504d25ddde345c1a66cfbcfa04e941e12d15",
        input: {
          image: image,
          scale: scale,
          face_enhance: face_enhance
        }
      })
    });

    const prediction = await response.json();

    if (prediction.error) {
      return res.status(500).json({ error: prediction.error });
    }

    if (prediction.output) {
      return res.status(200).json({ success: true, output: prediction.output });
    }

    // Polling until AI completes processing
    let pollUrl = prediction.urls.get;
    let status = prediction.status;
    let finalOutput = null;

    while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled') {
      await new Promise(r => setTimeout(r, 1200));
      const pollRes = await fetch(pollUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pollData = await pollRes.json();
      status = pollData.status;

      if (status === 'succeeded') {
        finalOutput = pollData.output;
        break;
      } else if (status === 'failed' || status === 'canceled') {
        return res.status(500).json({ error: 'AI processing failed or timed out' });
      }
    }

    return res.status(200).json({ success: true, output: finalOutput });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
