const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message ?? "Cererea a esuat.");
  }

  return data;
}

export async function registerUser(payload) {
  return request("/auth/register", { method: "POST", body: payload });
}

export async function loginUser(payload) {
  return request("/auth/login", { method: "POST", body: payload });
}

export async function fetchMe(token) {
  return request("/auth/me", { token });
}

export async function fetchAnnouncements({ category, q, token } = {}) {
  const searchParams = new URLSearchParams();
  if (category) {
    searchParams.set("category", category);
  }
  if (q) {
    searchParams.set("q", q);
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/announcements?${queryString}` : "/announcements";

  return request(path, { token });
}

export async function createAnnouncement(token, payload) {
  return request("/announcements", { method: "POST", body: payload, token });
}

export async function toggleAnnouncementLike(token, announcementId, isCurrentlyLiked) {
  return request(`/announcements/${announcementId}/likes`, {
    method: isCurrentlyLiked ? "DELETE" : "POST",
    token,
  });
}

export async function fetchNotifications(token) {
  return request("/announcements/notifications", { token });
}
