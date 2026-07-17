const BASE_URL = 'https://taxigo-server.onrender.com/api'

export const api = {
  // Auth
  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  // Bookings
  createBooking: async (data, token) => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  getMyBookings: async (token) => {
    const res = await fetch(`${BASE_URL}/bookings/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },

  getAllBookings: async (token) => {
    const res = await fetch(`${BASE_URL}/bookings/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },

  getDriverBookings: async (token) => {
    const res = await fetch(`${BASE_URL}/bookings/driver`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },

  assignDriver: async (bookingId, driverId, token) => {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ driverId })
    })
    return res.json()
  },

  updateStatus: async (bookingId, status, token) => {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
    return res.json()
  },

  // Drivers
  getDrivers: async (token) => {
    const res = await fetch(`${BASE_URL}/drivers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return res.json()
  },
}