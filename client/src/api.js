import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize token immediately from localStorage so components don't race with useEffect
const _storedToken = localStorage.getItem('token');
if (_storedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${_storedToken}`;
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const analyzeError = (errorText, language) => {
  return api.post('/debug/analyze', { errorText, language });
};

export const getSimilarErrors = (language) => {
  return api.get('/debug/similar', { params: { language } });
};

export const getUserHistory = (search, language, tag, page, limit) => {
  return api.get('/history', {
    params: { search, language, tag, page, limit },
  });
};

export const getErrorById = (id) => {
  return api.get(`/history/${id}`);
};

export const updateError = (id, userNotes, tags, isSolved) => {
  return api.put(`/history/${id}`, { userNotes, tags, isSolved });
};

export const deleteError = (id) => {
  return api.delete(`/history/${id}`);
};

export const getStats = () => {
  return api.get('/history/stats');
};

export const shareError = (errorId, isAnonymous) => {
  return api.post('/community/share', { errorId, isAnonymous });
};

export const unshareError = (id) => {
  return api.post(`/community/unshare/${id}`);
};

export const getCommunityFeed = (language, page, limit, sortBy) => {
  return api.get('/community/feed', {
    params: { language, page, limit, sortBy },
  });
};

export const getLanguages = () => {
  return api.get('/community/languages');
};

export const upvoteError = (id) => {
  return api.post(`/community/${id}/upvote`);
};

export const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/auth/google`;
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

export default api;
