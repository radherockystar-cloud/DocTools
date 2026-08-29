export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { image, scale = 2, face_enhance = true } = req.body;

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

    // Call Replicate Model
    const startRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: '9283608cc6b7be6b65a8e44983db012355fde41320b90f41a30142255dbce94c',
        input: {
          img: image,
          scale: Number(scale),
          face_enhance: Boolean(face_enhance)
        }
      })
    });

    const prediction = await startRes.json();

    if (startRes.status !== 201) {
      return res.status(500).json({
        success: false,
        error: prediction.detail || 'Failed to start AI task'
      });
    }

    // Poll until prediction completes
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed' && result.status !== 'canceled') {
      await new Promise((r) => setTimeout(r, 1000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { 'Authorization': `Token ${replicateApiToken}` }
      });
      result = await pollRes.json();
    }

    if (result.status === 'succeeded') {
      return res.status(200).json({ success: true, output: result.output });
    } else {
      return res.status(500).json({ success: false, error: result.error || 'AI enhancement failed' });
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
