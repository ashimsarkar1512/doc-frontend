// utils/getSeoData.ts

export async function getSeoData() {
  try {
    let apiUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiUrl) return null;

    // Normalize URL and ensure it has the /api/v1 path prefix
    apiUrl = apiUrl.replace(/\/$/, "");
    if (!apiUrl.includes("/api/v1")) {
      apiUrl = `${apiUrl}/api/v1`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

    const res = await fetch(`${apiUrl}/admin/website-settings`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

