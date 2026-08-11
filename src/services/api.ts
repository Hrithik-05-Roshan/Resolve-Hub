export async function resolveIssueWithAI(params: {
  prompt: string;
  platformHint?: string;
  orderIdHint?: string;
}) {
  try {
    const res = await fetch('/api/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Backend API request error, fallback client simulation:', error);
    return null;
  }
}
