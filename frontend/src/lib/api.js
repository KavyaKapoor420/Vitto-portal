// All API calls live here. 
// VITE_API_URL is set in .env.local for dev, and in Vercel env for prod.
// If not set, falls back to /api (works when proxied via vite.config.js)

const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) {
    // Throw an error with the server's message so UI can display it
    throw new Error(data.details ? data.details.join(', ') : data.error || 'Request failed')
  }
  return data
}

// POST /api/applications
export function submitApplication(body) {
  return request('/applications', { method: 'POST', body: JSON.stringify(body) })
}

// GET /api/applications?status=&search=
export function getApplications({ status, search } = {}) {
  const params = new URLSearchParams()
  if (status)  params.set('status', status)
  if (search)  params.set('search', search)
  const qs = params.toString()
  return request(`/applications${qs ? '?' + qs : ''}`)
}

// PATCH /api/applications/:id/status
export function updateStatus(id, status) {
  return request(`/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// GET /api/summary
export function getSummary() {
  return request('/summary')
}
