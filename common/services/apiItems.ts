import { BackendApiItem } from "./backend";

const apiItems: BackendApiItem[] = [
    {
        name: "SHOPPER_UUID",
        method: "GET",
        endpoint: "/api/v1/generate-uuid",
    },
    {
        name: "SEARCH_ADDRESS",
        method: "GET",
        endpoint: "/api/v1/search-address",
    },
    {
        name: "ADDRESS_EXTRA_AREA_CHECK",
        method: "POST",
        endpoint: "/api/v1/shopping/is-extra-shipping-price-area",
    },
    {
        name: "REGIST_POLICIES",
        method: "GET",
        endpoint: "/api/v1/members/policies",
    },
    {
        name: "BRAND_CATEGORIES",
        method: "GET",
        endpoint: "/api/v1/brand/categories",
    },
    {
        name: "ALL_DISPLAY_BRANDS",
        method: "GET",
        endpoint: "/api/v1/brand",
    },
    {
        name: "POLICY_NOW_DISPLAY_END_PREV_LIST",
        method: "GET",
        endpoint: "/api/v1/policies/:policy_type",
    },
    {
        name: "POLICY_DETAIL",
        method: "GET",
        endpoint: "/api/v1/policies/:policy_type/:id",
    },
    {
        name: 'POLICY_COMPANY_LIST',
        method: 'GET',
        endpoint: '/api/v1/middle-users'
    },
    {
        name: "PARTNERSHIP_INQUIRY_CATEGORIES",
        method: "GET",
        endpoint: "/api/v1/partners/contacts/types/:type_code/categories",
    },
    {
        name: "PARTNERSHIP_INQUIRY_TYPES",
        method: "GET",
        endpoint: "/api/v1/partners/contacts/types",
    },
    {
        name: "SEND_PARTNERSHIP_INQUIRY",
        method: "POST",
        endpoint: "/api/v1/partners/contacts/mail",
    },
    {
        name: "BLOCK_PAGE",
        method: "GET",
        endpoint: "/api/v1/exhibit/lego/:page_name",
    },
];

const exhibitApis: BackendApiItem[] = [
    {
        name: "FETCH_BASE_SEARCH_WORDS",
        method: "GET",
        endpoint: "/api/v1/exhibit/recommend-searches",
        headers: undefined,
    },
    {
        name: "FETCH_MAIN_BANNERS",
        method: "GET",
        endpoint: "/v1/fetch/main-banners",
        headers: undefined,
    },
    {
        name: "FETCH_MAIN_POPUPS",
        method: "GET",
        endpoint: "/api/v1/exhibit/popups",
    },
    {
        name: "TIME_DEAL",
        method: "GET",
        endpoint: "/api/v1/exhibit/time-attacks",
    },
    {
        name: "CARD_INSTALLMENT",
        method: "GET",
        endpoint: "/api/v1/informations/installment",
    },
    {
        name: "EXH_PLANNING_DETAIL",
        method: "GET",
        endpoint: "/api/v1/exhibit/planning-events/:id",
    },
    {
        name: "EXH_PLANNING_COMMENTS",
        method: "GET",
        endpoint: "/api/v1/exhibit/planning-events/:planning_id/comments",
    },
    {
        name: "CREATE_EXH_PLANNING_COMMENT",
        method: "POST",
        endpoint: "/api/v1/exhibit/planning-events/:planning_id/comments",
    },
    {
        name: "UPDATE_EXH_PLANNING_COMMENT",
        method: "POST",
        endpoint: "/api/v1/exhibit/planning-events/:planning_id/comments/:id",
    },
    {
        name: "DELETE_EXH_PLANNING_COMMENT",
        method: "POST",
        endpoint:
            "/api/v1/exhibit/planning-events/:planning_id/comments/:id:/destroy",
    },
    {
        name: "EXH_PLANNING_GROUP_GOODS",
        method: "GET",
        endpoint:
            "/api/v1/exhibit/planning-events/:planning_id/group-goods/:group_id",
    },
    {
        name: "SHOWCASE_SORT_LIST",
        method: "GET",
        endpoint: "/api/v1/exhibit/showcases/categories",
    },
    {
        name: "SHOWCASE_LIST",
        method: "GET",
        endpoint: "/api/v1/exhibit/showcases",
    },
    {
        name: "SHOWCASE_DETAIL",
        method: "GET",
        endpoint: "/api/v1/exhibit/showcases/:showcase_id",
    },
    {
        name: "ANOTHER_SHOWCASE_LIST",
        method: "GET",
        endpoint: "/api/v1/exhibit/showcases/:showcase_id/others",
    },
    {
        name: "CODY_SHOT_CATEGORIES",
        method: "GET",
        endpoint: "/api/v1/exhibit/codishots/categories",
        headers: undefined,
    },
    {
        name: "CODY_SHOT_DETAIL",
        method: "GET",
        endpoint: "/api/v1/exhibit/codishots/:cody_shot_id",
        headers: undefined,
    },
    {
        name: "MAIN_CODY_SHOTS",
        method: "GET",
        endpoint: "/api/v1/exhibit/codishots",
    },
    {
        name: "MAIN_RECENT_CODY_SHOTS",
        method: "GET",
        endpoint: "/api/v1/exhibit/codishots/recents",
    },
    {
        name: "MAIN_SPECIAL_EVENTS",
        method: "GET",
        endpoint: "/api/v1/exhibit/special-events",
    },
    {
        name: "SPECIAL_EVENT_DETAIL",
        method: "GET",
        endpoint: "/api/v1/exhibit/special-events/:event_id",
    },
    {
        name: "SPECIAL_EVENT_GROUP_GOODS",
        method: "GET",
        endpoint:
            "/api/v1/exhibit/special-events/:event_id/group-goods/:group_id",
    },
    {
        name: "SPECIAL_EVENT_COMMENTS",
        method: "GET",
        endpoint: "/api/v1/exhibit/special-events/:event_id/comments",
    },
    {
        name: "CREATE_SPECIAL_EVENT_COMMENT",
        method: "POST",
        endpoint: "/api/v1/exhibit/special-events/:event_id/comments",
    },
    {
        name: "DELETE_SPECIAL_EVENT_COMMENT",
        method: "POST",
        endpoint:
            "/api/v1/exhibit/special-events/:event_id/comments/:comment_id/destroy",
    },
    {
        name: "UPDATE_SPECIAL_EVENT_REVIEW_COMMENT",
        method: "POST",
        endpoint:
            "/api/v1/exhibit/special-events/:event_id/comments/:comment_id",
    },
    {
        name: "EXPERIENCEGROUP_REVIEW_LIST",
        method: "GET",
        endpoint: "/api/v1/exhibit/experience-reviews",
        isOnlyNetwork: true
    },
    {
        name: "EXPERIENCEGROUP_REVIEWABLE_GOODS",
        method: "GET",
        endpoint: "/api/v1/exhibit/experience-reviews/reviewable-goods",
    },
    {
        name: "EXPERIENCEGROUP_REVIEW_STORE",
        method: "POST",
        endpoint: "/api/v1/exhibit/experience-reviews",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    },
    {
        name: "EXPERIENCEGROUP_REVIEW_RECOMMENDATION",
        method: "POST",
        endpoint: "/api/v1/exhibit/experience-reviews/check-likes",
    },
    {
        name: "EXPERIENCEGROUP_REVIEW_RECOMMENDATION_ADD",
        method: "POST",
        endpoint: "/api/v1/exhibit/experience-reviews/like",
    },
    {
        name: "EXPERIENCEGROUP_REVIEW_RECOMMENDATION_CANCEL",
        method: "POST",
        endpoint: "/api/v1/exhibit/experience-reviews/unlike",
    },
    {
        name: "EXPERIENCEGROUP_REVIEW_DETAILS",
        method: "GET",
        endpoint: "/api/v1/exhibit/experience-reviews/:review_id",
    },
    {
        name: "JOINT_PURCHASE_LIST",
        method: "GET",
        endpoint: "/api/v1/exhibit/joint-purchases",
    },
    {
        name: "JOINT_PURCHASE_DETAIL",
        method: "GET",
        endpoint: "/api/v1/exhibit/joint-purchases/:jointPurchaseId",
    },
    {
        name: "JOINT_PURCHASE_APPLY",
        method: "POST",
        endpoint: "/api/v1/exhibit/joint-purchases/:jointPurchaseId/apply",
    },
    {
        name: "MAIN_RAFFLES",
        method: "GET",
        endpoint: "/api/v1/exhibit/raffles",
    },
    {
        name: "RAFFLES_ENDED",
        method: "GET",
        endpoint: "/api/v1/exhibit/raffles/ended-list",
    },
    {
        name: "RAFFLE_ENTRY",
        method: "POST",
        endpoint: "/api/v1/exhibit/raffles/:raffleId/apply",
    },
    {
        name: "RAFFLE_WINNERS",
        method: "GET",
        endpoint: "/api/v1/exhibit/raffles/:raffleId/winner-list",
    },
    {
        name: "RAFFLE_ENTRY_INFO",
        method: "GET",
        endpoint: "/api/v1/exhibit/raffles/:raffleId/entry-info",
    },
    {
        name: "RAFFLE_WINNING_RESULT",
        method: "GET",
        endpoint: "/api/v1/exhibit/raffles/:raffleId/winner-result",
    },
    {
        name: "RAFFLE_IS_BUYABLE_CHECK",
        method: "GET",
        endpoint: "/api/v1/exhibit/raffles/:raffleId/applied-raffle-state",
    },
    {
        name: "SPOT_THEME_TEMPLATE_LIST",
        method: "GET",
        endpoint: "/api/v1/exhibit/spot-themes/:spotThemeId/template-list",
    },
    {
        name: "MAIN_WING_BANNERS",
        method: "GET",
        endpoint: "/api/v1/exhibit/right-wing-banners",
    },
    {
        name: "MAIN_TOP_BANNERS",
        method: "GET",
        endpoint: "/api/v1/exhibit/top-banners/displays",
    },
    {
        name: "EXHIBIT_CATEGORY",
        method: "GET",
        endpoint: "/api/v1/exhibit/one-depth/:category_code",
    }
];

// AUTH
const authApis: BackendApiItem[] = [
    {
        name: "AUTH_LOGIN",
        method: "POST",
        endpoint: "/api/v1/auth/login",
        headers: undefined,
    },
    {
        name: "AUTH_LOGOUT",
        method: "POST",
        endpoint: "/api/v1/auth/logout",
        headers: undefined,
    },
    {
        name: "AUTH_REFRESH",
        method: "POST",
        endpoint: "/api/v1/auth/refresh",
        headers: undefined,
    },
    {
        name: "AUTH_ME",
        method: "POST",
        endpoint: "/api/v1/auth/me",
        headers: undefined,
    },
    {
        name: "AUTH_GUEST_LOGIN",
        method: "POST",
        endpoint: "/api/v1/auth/guest-login",
        headers: undefined,
    },
    {
        name: "AUTH_FIND_ID",
        method: "POST",
        endpoint: "/api/v1/members/find-login-id",
        headers: undefined,
    },
    {
        name: "AUTH_FIND_PASSWORD",
        method: "POST",
        endpoint: "/api/v1/members/find-password/prepare-for-new-password",
        headers: undefined,
    },
    {
        name: "AUTH_SEND_VERIFICATION_CODE_EMAIL",
        method: "POST",
        endpoint: "/api/v1/members/find-password/send-authcode-to-email",
        headers: undefined,
    },
    {
        name: "AUTH_SEND_VERIFICATION_CODE_PHONE",
        method: "POST",
        endpoint: "/api/v1/members/find-password/send-authcode-to-phone",
        headers: undefined,
    },
    {
        name: "AUTH_VERIFY_CODE",
        method: "POST",
        endpoint: "/api/v1/members/find-password/verify-authcode",
        headers: undefined,
    },
    {
        name: "AUTH_CHANGE_PASSWORD",
        method: "POST",
        endpoint: "/api/v1/members/find-password/set-new-password",
        headers: undefined,
    },
    {
        name: "AUTH_SEND_UNMASKED_ID_EMAIL",
        method: "POST",
        endpoint: "/api/v1/members/find-login-id/send-results-to-email",
        headers: undefined,
    },
    {
        name: "AUTH_SEND_UNMASKED_ID_PHONE",
        method: "POST",
        endpoint: "/api/v1/members/find-login-id/send-results-to-phone",
        headers: undefined,
    },
    {
        name: "AUTH_ID_DUPLICATE_CHECK",
        method: "POST",
        endpoint: "/api/v1/members/id-duplicate-check",
        headers: undefined,
    },
    {
        name: "AUTH_USER_REGIST",
        method: "POST",
        endpoint: "/api/v1/members",
        headers: undefined,
    },
    {
        name: "AUTH_TOKEN_DUPLICATE_CHECK",
        method: "POST",
        endpoint: "/api/v1/members/member-duplicate-check",
        headers: undefined,
    },
    {
        name: "AUTH_REFRESH_USER",
        method: "POST",
        endpoint: "/api/v1/auth/refresh",
        isOnlyNetwork: true
    },
    {
        name: 'AUTH_REFRESH_TOKEN',
        method: 'POST',
        endpoint: '/api/v1/auth/refresh-token'
    },
    {
        name: "AUTH_CAPTCHA_IMAGE",
        method: "POST",
        endpoint: "/api/v1/auth/make-captcha",
    },
    {
        name: "AUTH_CAPTCHA_CERTIFICATE",
        method: "POST",
        endpoint: "/api/v1/auth/check-captcha",
    },
    {
        name: "AUTH_PASSWORD_ADVICE_CHANGE",
        method: "POST",
        endpoint: "/api/v1/members/password-warnings/confirm",
    },
    {
        name: "AUTH_IDENTITY_VERIFICATION_CONFIRM",
        method: "POST",
        endpoint: "/api/v1/auth/confirm-identity-verification",
    },
];

const thirdPartyApis: BackendApiItem[] = [
    {
        name: "THIRD_PARTY_LOGIN",
        method: "POST",
        endpoint: "/api/v1/auth/login-with-3rd-party-authentication",
    },
    {
        name: "THIRD_PARTY_PROFILE",
        method: "POST",
        endpoint: "/api/v1/auth/profile-by-3rd-party-authentication",
    },
    {
        name: "THIRD_PARTY_TOKEN",
        method: "POST",
        endpoint: "/api/v1/3rd-party-authentications/:platform/generate-token",
    },
    {
        name: "THIRD_PARTY_TOKEN_RESULT",
        method: "POST",
        endpoint: "/api/v1/3rd-party-authentications/:platform/:token/result",
    },
    {
        name: "THIRD_PARTY_USABLES",
        method: "GET",
        endpoint: "/api/v1/3rd-party-authentications/availables",
    },
    {
        name: "THIRD_PARTY_REGIST_USER",
        method: "POST",
        endpoint: "/api/v1/members/by-3rd-party-authentication",
    },
    {
        name: "THIRD_PARTY_USER_DUPLICATE_CHECK",
        method: "POST",
        endpoint: "/api/v1/3rd-party-authentications/duplicates-by-email",
    },
    {
        name: "THIRD_PARTY_USER_CONNECT",
        method: "POST",
        endpoint:
            "/api/v1/3rd-party-authentications/:platform_type/:token/connect",
    },
    {
        name: "THIRD_PARTY_USER_DISCONNECT",
        method: "POST",
        endpoint: "/api/v1/3rd-party-authentications/:platform_type/disconnect",
    },
    {
        name: "THIRD_PARTY_IS_TOKEN_PROCESS_COMPLETED",
        method: "POST",
        endpoint:
            "/api/v1/3rd-party-authentications/:platform/:token/check-state",
    },
];

// 본인인증 관련
const identityVerificationApis: BackendApiItem[] = [
    {
        name: "IDENTITY_VERIFICATION_GENERATE_TOKEN",
        method: "POST",
        endpoint: "/api/v1/identity-verification/generate-token",
        headers: undefined,
    },
    {
        name: "IDENTITY_VERIFICATION_RESULT",
        method: "POST",
        endpoint: "/api/v1/identity-verification/:token/result",
        headers: undefined,
    },
];

// 검색엔진 관련
const searchEngineApis: BackendApiItem[] = [
    {
        name: "SEARCH_ENGINE_HOT_SEARCHES",
        method: "GET",
        endpoint: "/api/v1/search-engine/hot-searches",
        headers: undefined,
    },
    {
        name: "SEARCH_ENGINE_AUTO_COMPLETE",
        method: "GET",
        endpoint: "/api/v1/search-engine/auto-complete",
        headers: undefined,
    },
    {
        name: "SEARCH_ENGINE_SEARCH",
        method: "GET",
        endpoint: "/api/v1/search-engine/search",
        headers: undefined,
    },
    {
        name: "SEARCH_ENGINE_FEEDBACK",
        method: "POST",
        endpoint: "/api/v1/search-engine/feedback",
        headers: undefined,
    },
];

// 쇼핑 관련 API
const shoppingApis: BackendApiItem[] = [
    {
        name: "SHOPPING_ADD_CART_GOODS",
        method: "POST",
        endpoint: "/api/v1/shopping/carts",
    },
    {
        name: "SHOPPING_CART_ITEMS",
        method: "GET",
        endpoint: "/api/v1/shopping/carts",
        isOnlyNetwork: true        
    },
    {
        name: "SHOPPING_FETCH_LIKED_GOODS",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/check-many",
        headers: undefined,
    },
    {
        name: "SHOPPING_CART_ITEMS_REMOVE",
        method: "POST",
        endpoint: "/api/v1/shopping/carts/remove",
        headers: undefined,
    },
    {
        name: "SHOPPING_CART_ITEM_OPTION_AND_STOCK_UPDATE",
        method: "POST",
        endpoint: "/api/v1/shopping/carts/update",
        headers: undefined,
    },
    {
        name: "SHOPPING_CART_COUNT",
        method: "GET",
        endpoint: "/api/v1/shopping/carts/count",
        headers: undefined,
    },
    {
        name: "SHOPPING_WISH_BRANDS",
        method: "POST",
        endpoint: "/api/v1/my/wish/brands/check-many",
    },
    {
        name: "SHOPPING_GIVEAWAY_DETAIL",
        method: "GET",
        endpoint: "/api/v1/shopping/giveaways/:id",
    },
    {
        name: "SHOPPING_GIVEAWAY_DETAIL_TARGET_GOODS",
        method: "GET",
        endpoint: "/api/v1/shopping/giveaways/:id/on-goods",
    },
];

// 회원 마이페이지 api
const memberApis: BackendApiItem[] = [
    {
        name: "MEMBER_CONNECTED_SOCIALS",
        method: "GET",
        endpoint: "/api/v1/my/connected-3rd-party-authentications",
    },
    {
        name: "MEMBER_EDIT_INFO",
        method: "GET",
        endpoint: "/api/v1/my/me-for-edit",
        headers: undefined,
    },
    {
        name: "MEMBER_UPDATE_INFO",
        method: "POST",
        endpoint: "/api/v1/my",
        headers: undefined,
    },
    {
        name: "MEMBER_UPDATE_REVIEW",
        method: "POST",
        endpoint: "/api/v1/boards/goods-reviews/:id/edit",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    },
    {
        name: "MEMBER_REVIEW",
        method: "GET",
        endpoint: "/api/v1/boards/goods-reviews/:id/edit",
        headers: undefined,
    },
    {
        name: "MEMBER_STORE_REVIEW",
        method: "POST",
        endpoint: "/api/v1/boards/goods-reviews",
        headers: {
            "Content-Type": "multipart/form-data",
        },
    },
    {
        name: "MEMBER_REVIEWS",
        method: "GET",
        endpoint: "/api/v1/my/goods-reviews",
        headers: undefined,
        isOnlyNetwork: true,
    },
    {
        name: "MEMBER_CHANGE_PASSWORD",
        method: "POST",
        endpoint: "/api/v1/my/change-password",
        headers: undefined,
    },
    {
        name: "MEMBER_CHECK_DUPLICATE_EMAIL",
        method: "GET",
        endpoint: "/api/v1/my/check-unique-email",
        headers: undefined,
    },
    {
        name: "MEMBER_WITHDRAW_REASONS",
        method: "GET",
        endpoint: "/api/v1/members/withdraw/reasons",
        headers: undefined,
    },
    {
        name: "MEMBER_WITHDRAW",
        method: "POST",
        endpoint: "/api/v1/my/withdraw",
        headers: undefined,
    },
    {
        name: "MEMBER_PREPARE_FOR_EDIT",
        method: "POST",
        endpoint: "/api/v1/my/prepare-for-edit",
        headers: undefined,
    },
    {
        name: "MEMBER_CHECK_CURRENT_PASSWORD",
        method: "POST",
        endpoint: "/api/v1/my/check-current-password",
        headers: undefined,
    },
    {
        name: "MEMBER_COUPON_REGIST_LIST",
        method: "GET",
        endpoint: "/api/v1/my/extra-coupons",
        headers: undefined,
        isOnlyNetwork: true
    },
    {
        name: "MEMBER_COUPON_REGIST",
        method: "GET",
        endpoint: "/api/v1/promotions/extra-coupons/:coupon_id",
        headers: undefined,
    },
    {
        name: "MEMBER_COUPON_USABLE_GOODS",
        method: "GET",
        endpoint: "/api/v1/promotions/extra-coupons/:coupon_id/usable-goods",
        headers: undefined,
    },
    {
        name: "MEMBER_COUPON_USABLE_BRANDS",
        method: "GET",
        endpoint: "/api/v1/promotions/extra-coupons/:coupon_id/usable-brands",
        headers: undefined,
    },
    {
        name: "MEMBER_REGIST_COUPON",
        method: "POST",
        endpoint: "/api/v1/my/regist-paper-coupon",
        headers: undefined,
    },
    {
        name: "MEMBER_POINT_HISTORY",
        method: "GET",
        endpoint: "/api/v1/my/point-history",
        headers: undefined,
    },
    {
        name: "MEMBER_REFUND_ACCOUNT",
        method: "GET",
        endpoint: "/api/v1/my/refund-account",
        headers: undefined,
    },
    {
        name: "MEMBER_CREATE_OR_UPDATE_REFUND_ACCOUNT",
        method: "POST",
        endpoint: "/api/v1/my/refund-account",
        headers: undefined,
    },
    {
        name: "MEMBER_DELETE_REFUND_ACCOUNT",
        method: "POST",
        endpoint: "/api/v1/my/unset-refund-account",
        headers: undefined,
    },
    {
        name: "MEMBER_WISH_BRANDS",
        method: "GET",
        endpoint: "/api/v1/my/wish/brands",
        headers: undefined,
    },
    {
        name: "MEMBER_WISH_ALL_BRANDS",
        method: "GET",
        endpoint: "/api/v1/my/wish/brands/all",
        headers: undefined,
    },
    {
        name: "MEMBER_STORE_WISH_BRAND",
        method: "POST",
        endpoint: "/api/v1/my/wish/brands/wish",
        headers: undefined,
    },
    {
        name: "MEMBER_DELETE_WISH_BRAND",
        method: "POST",
        endpoint: "/api/v1/my/wish/brands/unwish",
        headers: undefined,
    },
    {
        name: "MEMBER_WISH_GOODS_FOLDERS",
        method: "GET",
        endpoint: "/api/v1/my/wish/goods/folders",
        headers: undefined,
        isOnlyNetwork: true,
    },
    {
        name: "MEMBER_WISH_GOODS",
        method: "GET",
        endpoint: "/api/v1/my/wish/goods",
        headers: undefined,
    },
    {
        name: "MEMBER_WISH_GOODS_IN_FOLDER",
        method: "GET",
        endpoint: "/api/v1/my/wish/goods/folders/:folder_id",
        headers: undefined,
        isOnlyNetwork: true,
    },
    {
        name: "MEMBER_DELETE_WISH_GOODS",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/unwish-many",
        headers: undefined,
    },
    {
        name: "MEMBER_CREATE_WISH_FOLDER",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/folders",
        headers: undefined,
    },
    {
        name: "MEMBER_UPDATE_WISH_FOLDER",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/folders/:folder_id",
        headers: undefined,
    },
    {
        name: "MEMBER_UPDATE_WISH_GOODS_FOLDER_SORT",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/folders/sort",
        headers: undefined,
    },
    {
        name: "MEMBER_DELETE_WISH_GOODS_FOLDER",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/folders/:folder_id/destroy",
        headers: undefined,
    },
    {
        name: "MEMBER_STORE_WISH_GOODS",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/wish",
        headers: undefined,
    },
    {
        name: "MEMBER_UPDATE_WISH_GOODS",
        method: "POST",
        endpoint: "/api/v1/my/wish/goods/move-many",
        headers: undefined,
    },
    {
        name: "MEMBER_RECENT_VIEW_GOODS",
        method: "GET",
        endpoint: "/api/v1/shopping/recent-view-goods",
        headers: undefined,
    },
    {
        name: "MEMBER_ADD_RECENT_VIEW_GOODS",
        method: "POST",
        endpoint: "/api/v1/shopping/recent-view-goods",
        headers: undefined,
    },
    {
        name: "MEMBER_RECENT_VIEW_PLANNINGS",
        method: "GET",
        endpoint: "/api/v1/shopping/recent-view-planning-events",
        headers: undefined,
    },
    {
        name: "MEMBER_ADD_RECENT_VIEW_PLANNING",
        method: "POST",
        endpoint: "/api/v1/shopping/recent-view-planning-events",
        headers: undefined,
    },
    {
        name: "MEMBER_AGGREGATES_BENEFIT",
        method: "GET",
        endpoint: "/api/v1/my/benefits",
        headers: undefined,
        isOnlyNetwork: true
    },
    {
        name: "MEMBER_AGGREGATES_ORDER",
        method: "GET",
        endpoint: "/api/v1/my/order-counts",
        headers: undefined,
    },
    {
        name: "MEMBER_AGGREGATES_GRADEUP_CONDITION",
        method: "GET",
        endpoint: "/api/v1/my/grade-up-condition",
        headers: undefined,
    },
    {
        name: "MEMBER_SELLER_QNA_LIST",
        method: "GET",
        endpoint: "/api/v1/my/seller-qna",
        headers: undefined,
    },
    {
        name: "MEMBER_PREPARE_FOR_EDIT_SOCIAL",
        method: "POST",
        endpoint: "/api/v1/my/prepare-for-edit-by-3rd-party-authentication",
        headers: undefined,
    },
    {
        name: "MEMBER_REVIEW_WRITABLES",
        method: "GET",
        endpoint: "/api/v1/boards/goods-reviews/writables",
        headers: undefined,
    },
    {
        name: "MEMBER_REVIEW_TEMPLATES",
        method: "GET",
        endpoint:
            "/api/v1/boards/goods-reviews/selectables-with-goods/:goods_id",
        headers: undefined,
    },
    {
        name: "MEMBER_STORE_QNA",
        method: "POST",
        endpoint: "/api/v1/cs/qna",
        headers: undefined,
    },
    {
        name: "MEMBER_QNA_LIST",
        method: "GET",
        endpoint: "/api/v1/my/qna",
        headers: undefined,
    },
    {
        name: "MEMBER_QNA",
        method: "GET",
        endpoint: "/api/v1/cs/qna/:id/edit",
        headers: undefined,
    },
    {
        name: "MEMBER_UPDATE_QNA",
        method: "POST",
        endpoint: "/api/v1/cs/qna/:id/edit",
        headers: undefined,
    },
    {
        name: "MEMBER_DELETE_QNA",
        method: "POST",
        endpoint: "/api/v1/cs/qna/:id/destroy",
        headers: undefined,
    },
    {
        name: "MEMBER_QNA_ORDERS",
        method: "GET",
        endpoint: "/api/v1/cs/qna/orders",
        headers: undefined,
    },
    {
        name: "MEMBER_AGGREGATES_REVIEW",
        method: "GET",
        endpoint: "/api/v1/my/goods-review-context",
        headers: undefined,
    },
    {
        name: "MEMBER_GRADE_COUPON_REGIST_COUNT",
        method: "GET",
        endpoint: "/api/v1/my/grades/coupon-regist-state",
        headers: undefined,
    },
    {
        name: "MEMBER_DOWNLOAD_GRADE_COUPON",
        method: "POST",
        endpoint: "/api/v1/my/grades/regist-coupon",
        headers: undefined,
    },
    {
        name: "MEMBER_RECEIVE_ADDRESS",
        method: "GET",
        endpoint: "/api/v1/shopping/receive-addresses",
    },
    {
        name: "MEMBER_STORE_RECEIVE_ADDRESS",
        method: "POST",
        endpoint: "/api/v1/shopping/receive-addresses",
    },
    {
        name: "MEMBER_DELETE_RECEIVE_ADDRESS",
        method: "POST",
        endpoint: "/api/v1/shopping/receive-addresses/:address_id/destroy",
    },
    {
        name: "MEMBER_DELETE_SELLER_QNA",
        method: "POST",
        endpoint: "/api/v1/cs/seller-qna/:id/destroy",
        headers: undefined,
    },
    {
        name: "MEMBER_SELLER_QNA_WRITABLE_ORDER_ITEMS",
        method: "GET",
        endpoint: "/api/v1/cs/seller-qna/order-items",
    },
    {
        name: "MEMBER_STORE_SELLER_QNA",
        method: "POST",
        endpoint: "/api/v1/cs/seller-qna",
    },
    {
        name: "MEMBER_SELLER_QNA",
        method: "GET",
        endpoint: "/api/v1/cs/seller-qna/:id/edit",
    },
    {
        name: "MEMBER_UPDATE_SELLER_QNA",
        method: "POST",
        endpoint: "/api/v1/cs/seller-qna/:id/edit",
    },
    {
        name: "MEMBER_ADULT_VERIFICATIONS",
        method: "POST",
        endpoint: "/api/v1/members/adult-verifications/confirm",
    },
    {
        name: "MEMBER_MY_SIZE",
        method: "GET",
        endpoint: "/api/v1/my/personalization",
    },
    {
        name: "MEMBER_MY_SIZE_UPDATE",
        method: "POST",
        endpoint: "/api/v1/my/personalization",
    },
    {
        name: "MEMBER_CLAIM_DELIVERY_DELAY_REPORTABLE_ORDER_ITEMS",
        method: "GET",
        endpoint: "/api/v1/my/complains/release-delay/reportables",
    },
    {
        name: "MEMBER_CLAIM_REPORT_DELIVERY_DELAY_ORDER_ITEMS",
        method: "POST",
        endpoint: "/api/v1/my/complains/release-delay/report",
    },
    {
        name: "MEMBER_CLAIM_DELIVERY_DELAY_REPORTED_ORDER_ITEMS",
        method: "GET",
        endpoint: "/api/v1/my/complains/release-delay",
    },
    {
        name: "MEMBER_CLAIM_SOLDOUT_CANCEL_REPORTABLE_ORDER_ITEMS",
        method: "GET",
        endpoint: "/api/v1/my/complains/cancel-by-soldout/reportables",
    },
    {
        name: "MEMBER_CLAIM_SOLDOUT_CANCEL_REPORTABLE_ORDER_ITEMS",
        method: "GET",
        endpoint: "/api/v1/my/complains/cancel-by-soldout/reportables",
    },
    {
        name: "MEMBER_CLAIM_SOLDOUT_CANCEL_REPORTED_ORDER_ITEMS",
        method: "GET",
        endpoint: "/api/v1/my/complains/cancel-by-soldout",
    },
    {
        name: "MEMBER_CLAIM_REPORT_SOLDOUT_CANCEL_ORDER_ITEMS",
        method: "POST",
        endpoint: "/api/v1/my/complains/cancel-by-soldout/report",
    },
    {
        name: "MEMBER_CLAIM_SOLDOUT_CANCEL_REPORTED_ORDER_ITEMS",
        method: "GET",
        endpoint: "/api/v1/my/orders/:order_id/payment-receipt",
    },
    {
        name: "MEMBER_CLAIM_REPORT_SOLDOUT_CANCEL_ORDER_ITEMS",
        method: "POST",
        endpoint: "/api/v1/my/complains/cancel-by-soldout/report",
    },
    {
        name: "MYPAGE_RAFFLE_ENTRY_LIST",
        method: "GET",
        endpoint: "/api/v1/my/raffles",
    },
];

// 마이페이지 주문 api
const myOrderApis: BackendApiItem[] = [
    {
        name: "MEMBER_ORDER_LIST",
        method: "GET",
        endpoint: "/api/v1/my/orders/normal-steps",
        headers: undefined,
        isOnlyNetwork: true,
    },
    {
        name: "MEMBER_ORDER_STATUS_CODES",
        method: "GET",
        endpoint: "/api/v1/my/orders/normal-steps/status-codes",
        headers: undefined,
    },
    {
        name: "ORDER_CONFIRM_PURCHASE",
        method: "POST",
        endpoint: "/api/v1/my/orders/normal-process/confirm-purchase",
        headers: undefined,
    },
    {
        name: "ORDER_CONFIRM_RECEIPT",
        method: "POST",
        endpoint: "/api/v1/my/orders/normal-process/delivered",
        headers: undefined,
    },
    {
        name: "ORDER_CANCEL_LIST",
        method: "GET",
        endpoint: "/api/v1/my/orders/cancel-steps",
        headers: undefined,
    },
    {
        name: "ORDER_CANCEL_CANCELABLES",
        method: "GET",
        endpoint: "/api/v1/my/orders/normal-steps/:order_id/cancelables",
        headers: undefined,
    },
    {
        name: "ORDER_CANCEL_REFUND_INFO",
        method: "POST",
        endpoint:
            "/api/v1/my/orders/normal-steps/:order_id/predict-refund-context-by-cancel",
        headers: undefined,
    },
    {
        name: "ORDER_CANCEL",
        method: "POST",
        endpoint: "/api/v1/my/orders/cancel-process/apply",
        headers: undefined,
    },
    {
        name: "ORDER_RETURN_LIST",
        method: "GET",
        endpoint: "/api/v1/my/orders/return-steps",
        headers: undefined,
    },
    {
        name: "ORDER_RETURN_RETURNABLE",
        method: "GET",
        endpoint:
            "/api/v1/my/orders/normal-steps/:order_id/returnables/:order_item_id",
        headers: undefined,
    },
    {
        name: "ORDER_RETURN_REFUND_INFO",
        method: "POST",
        endpoint:
            "/api/v1/my/orders/normal-steps/:order_id/predict-refund-context-by-return",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE_ADDITIONAL_PAYMENTS",
        method: "POST",
        endpoint:
            "/api/v1/my/orders/normal-steps/:order_id/paying-context-by-exchange",
        headers: undefined,
    },
    {
        name: "ORDER_RETURN",
        method: "POST",
        endpoint: "/api/v1/my/orders/return-process/apply",
        headers: undefined,
    },
    {
        name: "ORDER_RETURN_CANCEL",
        method: "POST",
        endpoint: "/api/v1/my/orders/return-process/recant",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE_LIST",
        method: "GET",
        endpoint: "/api/v1/my/orders/exchange-steps",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE_EXCHANGEABLE",
        method: "GET",
        endpoint:
            "/api/v1/my/orders/normal-steps/:order_id/exchangeables/:order_item_id",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE_SWITCH_RETURNABLE",
        method: "GET",
        endpoint: "/api/v1/my/orders/exchange-steps/:exchange_id/transferables",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE_CANCEL",
        method: "POST",
        endpoint: "/api/v1/my/orders/exchange-process/recant",
        headers: undefined,
    },
    {
        name: "ORDER_DETAIL",
        method: "GET",
        endpoint: "/api/v1/my/orders/:order_id/sheet",
        headers: undefined,
        isOnlyNetwork: true,
    },
    {
        name: "ORDER_CANCEL_DETAIL",
        method: "GET",
        endpoint: "/api/v1/my/orders/cancel-steps/:cancel_id",
        headers: undefined,
        isOnlyNetwork: true,
    },
    {
        name: "ORDER_RETURN_DETAIL",
        method: "GET",
        endpoint: "/api/v1/my/orders/return-steps/:return_id",
        headers: undefined,
        isOnlyNetwork: true,
    },
    {
        name: "ORDER_UPDATE_DELIVERY_ADDRESS_ID",
        method: "POST",
        endpoint: "/api/v1/my/orders/normal-process/change-receive-address-id",
        headers: undefined,
    },
    {
        name: "ORDER_RETURN_UPDATE_RETRIEVE_INVOICE",
        method: "POST",
        endpoint:
            "/api/v1/my/orders/return-process/change-retrieve-delivery-invoice",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE_PREPARE_PAY",
        method: "POST",
        endpoint: "/api/v1/my/orders/exchange-process/prepare-for-payment",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE",
        method: "POST",
        endpoint: "/api/v1/my/orders/exchange-process/apply",
        headers: undefined,
    },
    {
        name: "ORDER_EXCHANGE_DETAIL",
        method: "GET",
        endpoint: "/api/v1/my/orders/exchange-steps/:exchange_id",
        isOnlyNetwork: true,
    },
    {
        name: "ORDER_EXCHANGE_UPDATE_RETRIEVE_INVOICE",
        method: "POST",
        endpoint:
            "/api/v1/my/orders/exchange-process/change-retrieve-delivery-invoice",
    },
    {
        name: "ORDER_UPDATE_DELIVERY_ADDRESS_INFO",
        method: "POST",
        endpoint: "/api/v1/my/orders/normal-process/change-receive-address",
    },
    {
        name: "ORDER_EXCHANGE_PAY_RESULT",
        method: "POST",
        endpoint: "/api/v1/my/orders/exchange-process/check-payment",
    },
    {
        name: "ORDER_RECEIPT",
        method: "GET",
        endpoint: "/api/v1/my/orders/:order_id/payment-receipt",
    },
    {
        name: "ORDER_SEND_RECEIPT_TO_EMAIL",
        method: "POST",
        endpoint: "/api/v1/my/orders/:order_id/payment-receipt/send-to-mail",
    },
    {
        name: "ORDER_EXCHANGE_TO_RETURN",
        method: "POST",
        endpoint: "/api/v1/my/orders/exchange-process/transfer-to-return",
    },
    {
        name: "ORDER_EXCHANGE_SWITCH_RETURN_REFUND_INFO",
        method: "POST",
        endpoint:
            "/api/v1/my/orders/exchange-steps/:exchange_id/predict-refund-context-by-transfer-to-return",
    },
    {
        name: "ORDER_RETURN_VALIDATE_INVOICE",
        method: "POST",
        endpoint: "/api/v1/my/orders/validate-delivery-invoice",
    },
];

// 고객센터 api
const csApis: BackendApiItem[] = [
    {
        name: "CS_GRADE_BENEFIT_INFO",
        method: "GET",
        endpoint: "/api/v1/informations/member-grades",
        headers: undefined,
    },
    {
        name: "CS_QNA_TYPES",
        method: "GET",
        endpoint: "/api/v1/cs/qna/categories",
        headers: undefined,
    },
    {
        name: "CS_SELLER_QNA_TYPES",
        method: "GET",
        endpoint: "/api/v1/cs/seller-qna/categories",
        headers: undefined,
    },
    {
        name: "CS_FAQ_TYPES",
        method: "GET",
        endpoint: "/api/v1/cs/faq/types",
        headers: undefined,
    },
    {
        name: "CS_FAQ_LIST",
        method: "GET",
        endpoint: "/api/v1/cs/faq",
        headers: undefined,
    },
    {
        name: "CS_FAQ_ALL_LIST",
        method: "GET",
        endpoint: "/api/v1/cs/faq/all",
        headers: undefined,
    },
    {
        name: "CS_TOP_NOTICES",
        method: "GET",
        endpoint: "/api/v1/cs/notices/recents",
        headers: undefined,
    },
    {
        name: "CS_NOTICE_LIST",
        method: "GET",
        endpoint: "/api/v1/cs/notices",
        headers: undefined,
    },
    {
        name: "CS_IMPORTANT_NOTICES",
        method: "GET",
        endpoint: "/api/v1/cs/notices/importants",
        headers: undefined,
    },
    {
        name: "CS_NOTICE",
        method: "GET",
        endpoint: "/api/v1/cs/notices/:id",
        headers: undefined,
    },
    {
        name: "CS_SHOPPING_GUIDES_ACTIVES_INFORMATION",
        method: "GET",
        endpoint: "/api/v1/cs/shopping-guides/actives",
        headers: undefined,
    },
];

// 설정 관련
const globalConfigApis: BackendApiItem[] = [
    {
        name: "CONF_SHOP_INFORMATION",
        method: "GET",
        endpoint: "/api/v1/informations/shop",
        headers: undefined,
    },
    {
        name: "CONF_BANK_CODES",
        method: "GET",
        endpoint: "/api/v1/informations/banks",
        headers: undefined,
    },
    {
        name: "CONF_POINT_RULE",
        method: "GET",
        endpoint: "/api/v1/informations/point-rule",
        headers: undefined,
    },
    {
        name: "CONF_POINT_LABEL",
        method: "GET",
        endpoint: "/api/v1/informations/point-label",
        headers: undefined,
    },
    {
        name: "CONF_GRADE_REVIEW_POINT_SETTING",
        method: "GET",
        endpoint: "/api/v1/informations/review-point-by-member-grade",
        headers: undefined,
    },
    {
        name: "CONF_SHOES_SIZE",
        method: "GET",
        endpoint: "/api/v1/informations/shoes-sizes",
        headers: undefined,
    },
    {
        name: "CONF_CANCEL_REASONS",
        method: "GET",
        endpoint: "/api/v1/my/orders/cancel-process/reasons",
    },
    {
        name: "CONF_RETURN_REASONS",
        method: "GET",
        endpoint: "/api/v1/my/orders/return-process/reasons",
    },
    {
        name: "CONF_EXCHANGE_REASONS",
        method: "GET",
        endpoint: "/api/v1/my/orders/exchange-process/reasons",
    },
    {
        name: "CONF_DELIVERY_COMPANIES",
        method: "GET",
        endpoint: "/api/v1/informations/delivery-companies",
    },
    {
        name: "CONF_SHOES_CATEGORIES",
        method: "GET",
        endpoint: "/api/v1/informations/shoes-genders",
    },
    {
        name: "CONF_FIT_LIST",
        method: "GET",
        endpoint: "/api/v1/informations/fits",
    },
    {
        name: "CONF_CLAIM_REWARD_INFO",
        method: "GET",
        endpoint: "/api/v1/informations/complains",
    },
    {
        name: "CONF_INITIAL_SETTINGS",
        method: "GET",
        endpoint: "/api/v1/informations",
    },
];

// 리뉴얼 관련
const renewalApis: BackendApiItem[] = [
    {
        name: "RENEWAL_CHECK_EXIST_USER",
        method: "POST",
        endpoint: "/api/v1/renewal/find-member",
        headers: undefined,
    },
    {
        name: "RENEWAL_PASSWORD_CHANGE",
        method: "POST",
        endpoint: "/api/v1/renewal/find-member/set-new-password-and-identity",
        headers: undefined,
    },
];

// 상품 관련 API
const goodsApis: BackendApiItem[] = [
    {
        name: "GOODS_DISPLAY_ALL_CATEGORIES",
        method: "GET",
        endpoint: "/api/v1/goods-categories",
        headers: undefined,
    },
    {
        name: "GOODS_CATEGORIES_INCLUDE_COUNT",
        method: "POST",
        endpoint: "/api/v1/goods/count-by-category",
        headers: undefined,
    },
    {
        name: "GOODS_DETAIL_REVIEWS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/reviews",
    },
    {
        name: "GOODS_DETAIL_REVIEW_STATS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/reviews/stat-of-templates",
    },
    {
        name: "GOODS_DETAIL_PHOTO_REVIEW_DETAIL",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/reviews/photos/:reviewId",
    },
    {
        name: "FETCH_MAIN_CATEGORY_BEST_GOODS",
        method: "GET",
        endpoint: "/api/v1/best",
    },
    {
        name: "GOODS_DETAIL_PACKAGES",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/packages",
    },
    {
        name: "GOODS_DETAIL_BRAND_BEST_GOODS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/best-of-brand",
    },
    {
        name: "GOODS_DETAIL_MAIN_CATEGORY_BEST_GOODS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/best-of-category",
    },
    {
        name: "GOODS_DETAIL_BASIC_INFO",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId",
    },
    {
        name: "GOODS_DETAIL_INFORMATION",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/information",
    },
    {
        name: "GOODS_DETAIL_QNA_LIST",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/qna",
    },
    {
        name: "GOODS_DETAIL_QNA_WRITE_INFO",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/qna/information",
    },
    {
        name: "GOODS_STORE_QNA",
        method: "POST",
        endpoint: "/api/v1/goods/:goodsId/qna",
    },
    {
        name: "GOODS_UPDATE_QNA",
        method: "POST",
        endpoint: "/api/v1/goods/:goodsId/qna/:qnaId/edit",
    },
    {
        name: "GOODS_DESTROY_QNA",
        method: "POST",
        endpoint: "/api/v1/goods/:goodsId/qna/:qnaId/destroy",
    },
    {
        name: "GOODS_SHOW_QNA",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/qna/:qnaId/edit",
    },
    {
        name: "GOODS_DETAIL_DOWNLOADABLE_COUPONS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/coupons",
    },
    {
        name: "GOODS_DETAIL_COUPON_DOWNLOAD",
        method: "POST",
        endpoint: "/api/v1/promotions/extra-coupons/download",
    },
    {
        name: "GOODS_PHOTO_REVIEWS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/reviews/photos",
    },
    {
        name: "GOODS_DETAIL_PROMOTIONS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/promotions",
    },
    {
        name: "GOODS_OPTIONS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/options",
    },
    {
        name: "GOODS_EP_COUPON",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/ep-coupon",
    },
    {
        name: "GOODS_DETAIL_AGGREGATE",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/aggregate",
    },
    {
        name: "GOODS_DETAIL_STOCK",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/stock",
    },
    {
        name: "GOODS_DETAIL_BEST_REVIEWS",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/reviews/best",
    },
    {
        name: "GOODS_DETAIL_BEST_REVIEW",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/reviews/best/:reviewId",
    },
    {
        name: "GOODS_REVIEW_ZOOM_IMAGES",
        method: "GET",
        endpoint: "/api/v1/boards/goods-reviews/:reviewId/image-urls-by-photos",
    },
    {
        name: "GOODS_DETAIL_ME",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/me",
    },
    {
        name: "GOODS_CATEGORIES_COMMON",
        method: "GET",
        endpoint: "/api/v1/goods/common",
    },
    {
        name: "GOODS_CATEGORIES_FILTER",
        method: "GET",
        endpoint: "/api/v1/goods/filters-of-common",
    },
    {
        name: "GOODS_CATEGORIES_COMMON_COUNT",
        method: "GET",
        endpoint: "/api/v1/goods/total-count-of-common",
    },
    {
        name: "GOODS_CATEGORIES_COMMON_INFO",
        method: "GET",
        endpoint: "/api/v1/goods/category-information-of-common",
    },
    {
        name: "GOODS_BRAND_SHOP_INFO_WITH_CURATION",
        method: "GET",
        endpoint: "/api/v1/brand/:brandId",
        isOnlyNetwork: true,
    },
    {
        name: "GOODS_BRAND_SHOP_FILTERED_GOODS",
        method: "GET",
        endpoint: "/api/v1/brand/:brandId/goods",
        isOnlyNetwork: true,
    },
    {
        name: "GOODS_BRAND_SHOP_COUNT",
        method: "GET",
        endpoint: "/api/v1/brand/:brandId/total-count-of-goods",
    },
    {
        name: "GOODS_BRAND_SHOP_FILTER",
        method: "GET",
        endpoint: "/api/v1/brand/:brandId/filters-of-goods",
    },
    {
        name: "GOODS_SIZE_GUIDE",
        method: "GET",
        endpoint: "/api/v1/goods/size-table/:sellerId",
    },
    {
        name: "GOODS_SELLER_SHOP_INFO",
        method: "GET",
        endpoint: "/api/v1/seller-shops/:seller_id",
    },
    {
        name: "GOODS_SELLER_SHOP_CURATION",
        method: "GET",
        endpoint: "/api/v1/seller-shops/:seller_id/curation",
    },
    {
        name: "GOODS_SELLER_SHOP_FILTER",
        method: "GET",
        endpoint: "/api/v1/seller-shops/:seller_id/filters-of-goods",
    },
    {
        name: "GOODS_SELLER_SHOP_GOODS_COUNT",
        method: "GET",
        endpoint: "/api/v1/seller-shops/:seller_id/total-count-of-goods",
    },
    {
        name: "GOODS_SELLER_SHOP_FILTERED_GOODS",
        method: "GET",
        endpoint: "/api/v1/seller-shops/:seller_id/goods",
    },
    {
        name: "GOODS_RESTOCK_NOTIFY_APPLY",
        method: "POST",
        endpoint:
            "/api/v1/goods/:goodsId/option/:optionId/in-stock-notification",
    },
    {
        name: "GOODS_RAFFLE_DETAIL",
        method: "GET",
        endpoint: "/api/v1/exhibit/raffles/:raffleId",
    },
    {
        name: "GOODS_TIME_ATTACK_DETAIL",
        method: "GET",
        endpoint: "/api/v1/goods/:goodsId/timeattack"
    }
];

const orderApis: BackendApiItem[] = [
    {
        name: "ORDER_START",
        method: "POST",
        endpoint: "/api/v1/orders",
        headers: undefined,
    },
    {
        name: "ORDER_BASIC_DATA",
        method: "GET",
        endpoint: "/api/v1/orders/:order_id",
        headers: undefined,
    },
    {
        name: "ORDER_PREPARE_PAY",
        method: "POST",
        endpoint: "/api/v1/orders/payments/:order_id/prepare",
        headers: undefined,
    },
    {
        name: "ORDER_RESULT",
        method: "GET",
        endpoint: "/api/v1/orders/:order_id/result",
        headers: undefined,
    },
    {
        name: "ORDER_UTIL_CARD_INSTALLMENTS",
        method: "GET",
        endpoint: "/api/v1/orders/utilities/credit-card-installments",
        headers: undefined,
    },
    {
        name: "ORDER_UTIL_PAYMENT_METHODS",
        method: "GET",
        endpoint: "/api/v1/orders/utilities/payment-methods",
    },
    {
        name: "ORDER_UTIL_MY_PAY_METHODS",
        method: "POST",
        endpoint: "/api/v1/orders/utilities/my-pay/registed-pays",
    },
    {
        name: "ORDER_UTIL_MY_PAY_PREPARE_TOKEN",
        method: "POST",
        endpoint: "/api/v1/orders/utilities/my-pay/start-cert-context",
    },
    {
        name: "ORDER_UTIL_MY_PAY_PREPARE_REIGST",
        method: "POST",
        endpoint: "/api/v1/orders/utilities/my-pay/prepare-pays-regist",
    },
    {
        name: "ORDER_UTIL_MY_PAY_MANAGEMENT",
        method: "POST",
        endpoint: "/api/v1/orders/utilities/my-pay/prepare-pays-management",
    },
];

// 랭킹 관련
const rankingApis: BackendApiItem[] = [
    {
        name: "RANKING_ITEM",
        method: "GET",
        endpoint: "/api/v1/ranking/:ranking_type",
        headers: undefined,
    },
    {
        name: "RANKING_BRAND",
        method: "GET",
        endpoint: "/api/v1/ranking/brand",
        headers: undefined,
    },
];

// 앱 관련
const nativeAppApis: BackendApiItem[] = [
    {
        name: "APP_STORE_FIREBASE_MESSAGING_TOKEN",
        method: "POST",
        endpoint: "/api/v1/native-app/store-token",
        headers: undefined,
    },
    {
        name: "APP_UPDATE_FIREBASE_MESSAGING_TOKEN",
        method: "POST",
        endpoint: "/api/v1/native-app/update-token-member",
        headers: undefined,
    },
    {
        name: "APP_IS_RECEIVE_PUSH",
        method: "GET",
        endpoint: "/api/v1/native-app/push-agreement",
        headers: undefined,
    },
    {
        name: "APP_UPDATE_PUSH_NOTIFICATION_AGREE",
        method: "POST",
        endpoint: "/api/v1/native-app/update-token-push-agreement",
        headers: undefined,
    },
    {
        name: "APP_INFO",
        method: "GET",
        endpoint: "/api/v1/native-app/version-info",
        headers: undefined,
    },
    {
        name: "APP_BIOMETRIC_CREATE",
        method: "POST",
        endpoint: "/api/v1/native-app/app-access-token",
        headers: undefined,
    },
    {
        name: "APP_BIOMETRIC_LOGIN",
        method: "POST",
        endpoint: "/api/v1/auth/login-with-app-access-token",
        headers: undefined,
    },
];

const liveCommerceApis: BackendApiItem[] = [
    {
        name: 'GENERATE_LIVE_COMMERCE_TOKEN',
        method: 'POST',
        endpoint: '/api/v1/live-commerce/user-token'
    },
    {
        name: 'GET_SCHEDULE_BROAD_CAST',
        method: 'GET',
        endpoint: '/api/v1/live-commerce/schedules'
    },
    {
        name: 'GET_ACTIVE_BROAD_CAST',
        method: 'GET',
        endpoint: '/api/v1/live-commerce/actives'
    }
]

export default apiItems
    .concat(authApis)
    .concat(identityVerificationApis)
    .concat(searchEngineApis)
    .concat(shoppingApis)
    .concat(memberApis)
    .concat(csApis)
    .concat(goodsApis)
    .concat(globalConfigApis)
    .concat(renewalApis)
    .concat(exhibitApis)
    .concat(orderApis)
    .concat(myOrderApis)
    .concat(thirdPartyApis)
    .concat(rankingApis)
    .concat(nativeAppApis)
    .concat(liveCommerceApis);
