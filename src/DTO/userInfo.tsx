
export interface UserInfoResponse {
    username: string;
    gmail: string;
    isPremium: boolean;
    premiumExpiryDate: Date | null;
    subscriptionPlan: string | null;
}