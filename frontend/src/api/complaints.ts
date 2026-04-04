import axios from "axios";

export interface ComplaintData {
    dentist_id: number;
    reason: string;
}

export const submitComplaint = async (data: ComplaintData) => {
    const accessToken = localStorage.getItem('access_token');
    const isLocalMode = accessToken?.startsWith('local_token_');

    // In local mode, simulate success (can't auth against real backend)
    if (isLocalMode) {
        await new Promise(res => setTimeout(res, 500));
        return { message: "Complaint submitted (local mode)", dentist_new_rating: null };
    }

    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
    };
    
    // Add auth token if available (optional on backend)
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await axios.post(`${baseURL}/complaints/`, data, { headers });
    return response.data;
};
