import { useQuery } from "@tanstack/react-query";
import api from "./api";

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    patient_name: string;
}

export interface DentistReviewsResponse {
    average: number;
    count: number;
    reviews: Review[];
}

export const useDentistReviews = (dentistId?: number) => {
    return useQuery({
        queryKey: ['dentistReviews', dentistId],
        queryFn: async () => {
            const response = await api.get<DentistReviewsResponse>(`/reviews/dentist/${dentistId}`);
            return response.data;
        },
        enabled: !!dentistId
    });
};
