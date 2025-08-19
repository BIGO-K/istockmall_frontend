import { Grade } from "$/@type/member/grade";

/**
 * STORE에서 사용되는 인증 유저
*/
interface AuthUser {
    loginId: string;
    name: string;
    grade: Grade;
    isAwaked: boolean;
    isVerifyAge: boolean;
    isNeedPasswordUpdate: boolean;
    isCertificated: boolean;
    loginType: string;
}

interface AuthToken {
    token: string;
    refreshToken: string;
    expiredAt: string;
}

interface User {
    loginId: string;
    name: string;
    grade: Grade;
    phone?: string;
    email?: string;
    birthday?: string;
    loginType: string;
}

// 회원정보
interface UserInfo extends AuthToken {
    user: User;
    isAwaked: boolean;
    isVerifyAge: boolean;
    isNeedPasswordUpdate: boolean;
    isCertificated: boolean;
    publishedAwakeCouponId: number;
    publishedComebackCouponId: number;
}

// 본인인증 정보
interface IdentityProfile {
    birthDay: Date;
    gender: string;
    phoneNumber: string;
    name: string;
    token: string;
}

// 소셜회원 프로필
interface SocialUserProfile {
    platform: string;
    accessToken: string;
    birthdate: string;
    email: string;
    gender: string;
    name: string;
    phoneNumber: string;
}

interface SocialUserProfileResponse {
    birthdate: string;
    email: string;
    gender: string;
    name: string;
    phone_number: string;
}

type UserResponse = {
    token: string;
    refresh_token: string,
    expiry_at: string,
    user: {
        login_id: string;
        name: string;
        grade: {
            id: number;
            name: string;
            image_url: string;
        };
    };
    is_verify_age: boolean;
    is_awaked: boolean;
    is_need_update_password: boolean;
    is_certificated: boolean;
    published_awake_coupon_id: number;
    published_comeback_coupon_id: number;
};

type SocialUserResponse = {
    token: string;
    refresh_token: string,
    expiry_at: string,
    user: {
        login_id: string;
        name: string;
        grade: {
            id: number;
            name: string;
            image_url: string;
        };
    };
    is_verify_age: boolean;
    is_awaked: boolean;
    is_certificated: boolean;
    published_awake_coupon_id: number;
    published_comeback_coupon_id: number;
};



type RegistUser = {
    id: string;
    password: string;
    passwordConfirm: string;
    name: string;
    birthYear?: number;
    birthMonth?: number;
    birthDay?: number;
    birthdate?: string;
    phoneNumber: string;
    gender: string;
    isOver14: boolean;
    // isAcceptTerms: boolean;
    // isAcceptPrivacyPolicy: boolean;
    isReceiveMarketingMail: boolean;
    isReceiveMarketingSms: boolean;
    identityProfileToken: string;
    policies: {
        id: number;
        code: string;
        isAgree: boolean;
    }[];
};

type RegistEvent = {
    type: string;
    name?: string;
    amount_type?: string;
    amount?: number;
    point?: number
}

type RegistEventResponse = {
    regist_events: RegistEvent[]
}

type SocialRegistUser = {
    platform: string;
    token: string;
    name: string;
    email: string;
    phoneNumber: string;
    birthYear?: number;
    birthMonth?: number;
    birthDay?: number;
    birthdate?: string;
    gender: string;
    isOver14: boolean;
    isReceiveMarketingMail: boolean;
    isReceiveMarketingSms: boolean;
    policies: {
        id: number;
        code: string;
        isAgree: boolean;
    }[];
};

type LoginResult = {
    isLoginComplete: boolean;
    verifiedAge: boolean;
    isAwaked: boolean;
    needPasswordUpdate: boolean;
    isDuplicate: boolean;
    isSocialNameEmpty: boolean;
}

type DuplicateSocialUser = {
    platform: string;
    maskingId: string;
};

export type {
    UserInfo,
    IdentityProfile,
    AuthToken,
    AuthUser,
    User,
    UserResponse,
    SocialUserResponse,
    RegistUser,
    RegistEvent,
    RegistEventResponse,
    SocialUserProfile,
    SocialUserProfileResponse,
    SocialRegistUser,
    DuplicateSocialUser,
    LoginResult,
};
