import { typeCastBoolean, typeCastNumber } from '$/filters';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { 
    BankCode, 
    BankCodesResponse,
    DeliveryCompany,
    InitialSettings,
    InitialSettingsResponse,
} from '$/@type/configs';
import BaseRepository from '$/repository/baseRepository';
import { pluck } from '$/functions';

/**
 * 프로젝트마다 바뀌는 상수값 조회하는 레파지토리
 */
class GlobalConfigsRepository extends BaseRepository
{
    /**
     * 은행 코드/라벨 리스트
     */
    bankCodes: BankCode[] = [];

    /**
     * 택배사 리스트
     */
    deliveryCompanies: DeliveryCompany[] = [];

    /**
     * 은행 코드/라벨 SETTER
     * 
     * @returns Promise
     */
    async setBankCodes(): Promise<void> {
        const { bank_codes } = await this.dataSource.execute<BankCodesResponse>(
            'CONF_BANK_CODES',
            {},
            {}
        );

        this.bankCodes = bank_codes.map((bankCode) => {
            return {
                code: bankCode.code,
                label: bankCode.label,
            }
        })
    }
    
    /**
     * 은행 코드/라벨 GETTER
     */
    async getBankCodes(): Promise<BankCode[]> {
        if (this.bankCodes.length < 1) {
            await this.setBankCodes();
        }

        return this.bankCodes;
    }

    /**
     * 택배사 리스트 GETTER
     */
    async getDeliveryCompanies(): Promise<DeliveryCompany[]>{
        if (this.deliveryCompanies.length < 1) {
            await this.setDeliveryCompanies();
        }

        return this.deliveryCompanies;
    }

    /**
     * 택배사 리스트 SETTER
     */
    async setDeliveryCompanies(): Promise<void>{
        const { delivery_companies } = await this.dataSource.execute<{
            delivery_companies: DeliveryCompany[]
        }>(
            'CONF_DELIVERY_COMPANIES',
            {},
            {},
        );
        
        this.deliveryCompanies = delivery_companies;
    }
    
    /**
     * 공통 config 정보 조회
     * 쇼핑몰 정보, 포인트 관련 정보(라벨, 정책), 유료옵션 사용여부
     * @returns 
     */
    async getGlobalConfigs(): Promise<InitialSettings> {
        const { 
            shop, 
            point, 
            paid_features, 
            grade_colors, 
            seo,
            marketing,
            gnb,
            design,
            goods_price_krw_unit
        } = await this.dataSource.execute<InitialSettingsResponse>(
            'CONF_INITIAL_SETTINGS',
            {},
            {}
        );        
        // 쇼핑몰 정보
        const shopInfo: InitialSettings['shop'] = {
            name: shop.name || '',
            nameInBusiness: shop.name_in_business || '',
            engName: shop.eng_name || '',
            businessNumber: shop.business_number || '',
            sellAccount: shop.sell_account || '',
            ceo: shop.ceo_name || '',
            phone: shop.tel || '',
            privacyManager: shop.privacy_manager || '',
            baseAddress: shop.base_address || '',
            detailAddress: shop.detail_address || '',
            copyrightText: shop.copyright_text || '',
            homepageUrl: shop.homepage_url || '',
            paymentServiceInfoUrl: shop.payment_service_info_url === null ? '' : (shop.payment_service_info_url || ''),
            businessServiceInfoUrl: shop.business_service_info_url || '',
            bankOwnerName: shop.bank_owner_name || '',
            hasTransferMember: typeCastBoolean(shop.use_renewal),
            cs : {
                tel: shop.cs_tel || '',
                email: shop.cs_email,
                time: shop.cs_time,
                weekday: shop.cs_weekday,
                lunchTime: shop.cs_lunch_time,
                offday: shop.cs_offday,
                faxNumber: shop.cs_fax_number,
                kakaoWeekday: shop.kakao_cs_weekday || '',
                kakaoTime: shop.kakao_cs_time || '',
                kakaoFriendName: shop.kakao_frined_name || '',
            },
            snsLink: {
                instagram: shop.instagram_link || '',
                facebook: shop.facebook_link || '',
                youtube: shop.youtube_link || '',
                naverBlog: shop.naver_blog_link || '',
                kakaoChannel: shop.kakao_channel_link || '',
            }
        }

        // 배송지연/품절취소 보상정책 및 최대보상가
        const rewardPolicies: InitialSettings['paidFeatures']['rewardPolicies'] = paid_features.reward_policies ? {
            deliveryDelayRewardPolicies: paid_features.reward_policies.delivery_delay_reward_policies.map(policy => {
                return {
                    day: policy.day,
                    rewardRate: policy.reward_rate,
                }
            }),
            soldoutCancelRewardPolicies: paid_features.reward_policies.soldout_cancel_reward_policies.map(policy => {
                return {
                    day: policy.day,
                    rewardRate: policy.reward_rate,
                }
            }),
            maximumRewardPrice: paid_features.reward_policies.maximum_reward_price,
            useDeliveryDelay: paid_features.reward_policies.maximum_reward_price > 0 
                && !(pluck(paid_features.reward_policies.delivery_delay_reward_policies, 'reward_rate') || []).every(rate => rate == 0),
            useSoldoutCancel: paid_features.reward_policies.maximum_reward_price > 0 
                && !(pluck(paid_features.reward_policies.soldout_cancel_reward_policies, 'reward_rate') || []).every(rate => rate == 0),
        } : {
            deliveryDelayRewardPolicies: [],
            soldoutCancelRewardPolicies: [],
            maximumRewardPrice: 0,
            useDeliveryDelay: false,
            useSoldoutCancel: false,
        }

        // 유료기능
        const paidFeatures: InitialSettings['paidFeatures'] = {
            reward: typeCastBoolean(paid_features.reward),
            rewardPolicies: rewardPolicies,
            personalization: typeCastBoolean(paid_features.personalization),
            reviewTemplate: typeCastBoolean(paid_features.review_template),
            ranking: typeCastBoolean(paid_features.ranking),
            timeDeal: typeCastBoolean(paid_features.time_deal),
            codyShot: typeCastBoolean(paid_features.cody_shot),
            showcase: typeCastBoolean(paid_features.showcase),
            raffle: typeCastBoolean(paid_features.raffle),
            jointPurchase: typeCastBoolean(paid_features.joint_purchase),
            specialEvent: typeCastBoolean(paid_features.special_event),
            experienceReview: typeCastBoolean(paid_features.experience_review),
            socialLogin: typeCastBoolean(paid_features.social_login),
            usableSocialLogins: {
                kakaotalk: paid_features.usable_social_logins.includes('kakao'),
                naver: paid_features.usable_social_logins.includes('naver'),
                apple: paid_features.usable_social_logins.includes('apple'),
                payco: paid_features.usable_social_logins.includes('payco'),
                facebook: paid_features.usable_social_logins.includes('facebook'),
            },
            activesEasypays: {
                isNaverPayUse: paid_features.active_easypays.includes('naverpay'),
                isKakaoPayUse: paid_features.active_easypays.includes('kakaopay'),
                isPaycoUse: paid_features.active_easypays.includes('payco'),
                isTossUse: paid_features.active_easypays.includes('toss'),
            },
            myPay: typeCastBoolean(paid_features.my_pay)
        }

        // 적립금 관련 정보
        const pointInfo: InitialSettings['point'] = {
            label: {
                name: point.label_name,
                suffix: point.suffix,
            },
            rules: {
                maxUsableAmount: point.max_usable_amount,
                maxUsableAmountType: point.max_usable_amount_type,
                minUsableBalance: point.min_usable_balance,
                photoReviewPoint: point.photo_review_point,
                usableMonth: point.usable_month,
                textReviewPoint: point.review_point,
            },
            gradeRules: point.grade_rules.map((gradeRule) => {
                return {
                    gradeId: gradeRule.grade_id,
                    gradeName: gradeRule.grade_name,
                    textReviewPoint: gradeRule.text_review_point,
                    photoReviewPoint: gradeRule.photo_review_point,
                    useGradeRule: typeCastBoolean(gradeRule.use_grade_rule),
                }
            })
        }

        const marketingInfo: InitialSettings['marketing'] = {
            gtm: {
                id: marketing.gtm?.id || '',
            },
            kakaoPixel: {
                id: marketing.kakao_pixel?.id || '',
            },
            facebookPixel: {
                id: marketing.facebook_pixel?.id || '',
            },
            criteo: {
                id: marketing.criteo?.id || '',
            },
        }

        const gnbInfo: InitialSettings['gnb'] = {
            raffle: gnb.raffle,
            jointPurchase: gnb.joint_purchase,            
            spotThemes: gnb.spot_themes?.map((spotTheme) => {
                return {
                    id: spotTheme.id,
                    name: spotTheme.name,
                    isUseUrl: spotTheme.is_use_url,
                    url: spotTheme?.url
                }
            }) || []
        }

        const designInfo: InitialSettings['design'] = {
            mainColor: design?.main_color || '#1f1f1f',
            subColor: design?.sub_color || '#f84f34',
            supportColor: design?.support_color || '#4457a7',
            colorVersion: design?.color_version || 'black',
            useHeaderColor: typeCastBoolean(design?.use_header_color),
            headerType: design?.header_type || 'A',
            footerType: design?.footer_type || 'A',
            toolbarType: design?.toolbar_type || 'A',
            pcMainPopupType : design.pc_main_popup_type || 'normal',
            pcMainPopupVersion : design.pc_main_popup_version || 'A',
            mobileMainPopupType: design?.mobile_main_popup_type || 'normal',
            mobileMainPopupVersion: design?.mobile_main_popup_version || 'A',
            // mobileRankingType: design?.mobile_ranking_type || 'A',
            // pcRankingType: design?.pc_ranking_type || 'A',            
            mobileRankingType: 'D',
            pcRankingType: 'D',        
            mobileTopBannerType : design?.mobile_top_banner_type || 'custom',
            pcTopBannerType: design?.pc_top_banner_type || 'A',
            pcWingBannerType: design?.pc_wing_banner_type || 'A',
        }
        
        return {
            shop: shopInfo,
            point: {
                label: pointInfo.label,
                rules: pointInfo.rules,
                gradeRules: pointInfo.gradeRules,
            },
            paidFeatures: paidFeatures,
            gradeColors: grade_colors.map(gradeColor => {
                return {
                    color: gradeColor.color_code,
                    seq: (gradeColor.grade_order + 1)
                }
            }),
            seo: {
                title: seo.title || '',
                description: seo.description || '',
                keywords: seo.keywords || [],
                siteVerificationKey: {
                    naver: seo.site_verification_key?.naver || '',
                }
            },
            marketing: marketingInfo,
            gnb: gnbInfo,
            design: designInfo,
            goodsPriceKrwUnit: goods_price_krw_unit || 10
        }
    }
}

const globalConfigsRepository = new GlobalConfigsRepository(
    new BackendMapper
);

export { globalConfigsRepository }