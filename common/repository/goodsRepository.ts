import {
    ResponseGoods,
    BaseGoods,
    GoodsBanner,
    ResponseGoodsBasicInfo,
    GoodsBasicInfo,
    GoodsInformation,
    GoodsDetail,
    DetailDeliveryInfo,
    ReturnDeliveryInfo,
    GoodsOptions,
    Review,
    ReviewResponse,
    ReviewPaginator,
    ReviewPaginatorResponse,
    PhotoReviewPaginator,
    QnaPaginator,
    GoodsInformationResponse,
    QnaPaginatorResponse,
    GoodsQnaDetail,
    GoodsPricePromotion,
    AggregateReviewAndQna,
    QnaInfo,
    Goods,
    TimeDeal,
    OptionalReviewStatistics,
    OptionalReviewStatisticsResponse,
} from "$/@type/goods";
import BaseRepository from "$/repository/baseRepository";
import { BackendMapper } from "$/dataMapper/backendMapper";
import { DownLoadCoupon, EpCoupon, EpCouponResponse } from "$/@type/coupon";
import { typeCastNumber } from "$/filters";
import { PaginatorResponse } from "$/@type";

class GoodsRepository extends BaseRepository {
    /**
     * 카테고리 베스트 상품 조회
     * @param {string} depth1CategoryCode: 1뎁스 카테고리 코드
     */
    async getMainBestCategoryGoods(depth1CategoryCode: string): Promise<{
        bestGoods: Goods[];
    }> {
        const response = await this.dataSource.execute<{
            best_goods: ResponseGoods[];
        }>(
            "FETCH_MAIN_CATEGORY_BEST_GOODS",
            {
                category_code: depth1CategoryCode,
                is_all_category: depth1CategoryCode === "" ? true : false,
            },
            {}
        );

        const bestGoods = response.best_goods.map(function (bestGoods) {
            return {
                id: bestGoods.id,
                name: bestGoods.name,
                brandName: bestGoods.brand_name,
                thumbnailUrl: bestGoods.thumbnail_url,
                price: bestGoods.price,
                sellPrice: bestGoods.sell_price,
                baseDiscountedPrice: bestGoods.base_discounted_price,
                stock: bestGoods.stock,
                saleRate: bestGoods.sale_rate,
                isSoldout: bestGoods.is_soldout,
                isOnlyAdult: bestGoods.is_only_adult,
                headline: bestGoods.headline,
                mouseOverImageUrl: bestGoods.mouse_over_image_url,    
                icon: bestGoods.icon === null ? null :          {
                    backgroundColor: bestGoods.icon.background_color_code,
                    textColor: bestGoods.icon.font_color_code,
                    label: bestGoods.icon.label
                }   
            };
        });

        return {
            bestGoods: bestGoods,
        };
    }

    /**
     * 상품 상세정보 탭 정보 조회
     * @param goodsId : 상품 ID
     * @returns GoodsInformation
     */
    async getGoodsDetailInformation(
        goodsId: number
    ): Promise<GoodsInformation> {
        const response =
            await this.dataSource.execute<GoodsInformationResponse>(
                'GOODS_DETAIL_INFORMATION',
                {
                    goodsId: goodsId,
                },
                {}
            );

        const topBannerList = response.top_banners.map(function (banner) {
            const topBanner: GoodsBanner = {
                isEditorUse: banner.is_editor_use,
                contents: banner.contents,
                imageUrl: banner.image_url,
                imageAlt: banner.image_alt,
            };
            return topBanner;
        });

        const bottomBannerList = response.bottom_banners.map(function (banner) {
            const topBanner: GoodsBanner = {
                isEditorUse: banner.is_editor_use,
                contents: banner.contents,
                imageUrl: banner.image_url,
                imageAlt: banner.image_alt,
            };
            return topBanner;
        });

        const goodsInformation: GoodsInformation = {
            detailInfo: response.detail_info,
            topBanners: topBannerList,
            bottomBanners: bottomBannerList,
            videoUrl: response.video_url === null ? '' : response.video_url,
            mandatory: response.mandatory,
            useStateLabel: response.use_state_label,
            originLabel: response.origin_label,
            sellerHolidayMessage: response.seller_holiday_message,
            sellerHoliday: response.seller_holiday ? {
                reason: response.seller_holiday.reason,
                startAt: response.seller_holiday.start_at,
                endAt: response.seller_holiday.end_at,
                releaseAt: response.seller_holiday.release_at,
            } : undefined
        };

        return goodsInformation;
    }

    /**
     * 상품 옵션 정보 조회
     * @param goodsId: 상품ID
     * @returns GoodsOptions[]
     */
    async getOptions(goodsId: number): Promise<GoodsOptions[]> {
        const response = await this.dataSource.execute<{
            options: {
                name: string;
                sub: {
                    name: string;
                    qty: number;
                    code: number;
                }[];
            }[];
        }>(
            "GOODS_OPTIONS",
            {
                goodsId: goodsId,
            },
            {}
        );

        return response.options.map(function (option) {
            let subOptionsTotalStock = 0;
            const subOptions = option.sub.map(function (subOption) {
                subOptionsTotalStock += subOption.qty;
                return {
                    price: 0,
                    id: subOption.code,
                    stock: subOption.qty,
                    name: subOption.name.trim(),
                    isSelectAble: subOption.qty > 0 ? true : false,
                };
            });

            return {
                name: option.name.trim(),
                price: 0,
                subOptions,
                isSelectAble: subOptionsTotalStock > 0 ? true : false,
            };
        });
    }

    /**
     * 상품 재고 조회
     * @param goodsId : 상품 ID
     * @returns
     */
    async getStock(
        goodsId: number
    ): Promise<{ stock: number; is_soldout: boolean }> {
        const response = await this.dataSource.execute<{
            stock: number;
            is_soldout: boolean;
        }>(
            "GOODS_DETAIL_STOCK",
            {
                goodsId,
            },
            {}
        );

        return {
            is_soldout: response.is_soldout,
            stock: response.stock,
        };
    }
    /**
     * 베스트 리뷰 정보 조회
     * @param goodsId
     */
    async bestReviews(goodsId: number): Promise<Review[]> {
        const response = await this.dataSource.execute<{
            best_reviews: ReviewResponse[];
        }>(
            "GOODS_DETAIL_BEST_REVIEWS",
            {
                goodsId,
            },
            {}
        );

        return response.best_reviews.map(function (bestReview) {
            return {
                id: bestReview.id,
                contents: bestReview.contents,
                rate: bestReview.rate,
                isPhotoReview: bestReview.is_photo_review,
                imageUrls: bestReview.image_urls,
                photoCount: bestReview.image_urls.length,
                createdAt: bestReview.created_at,
                writerGradeImageUrl: bestReview.writer_grade_image_url,
                writerGradeLabel: bestReview.writer_grade_label,
                writerId: bestReview.writer_masking_id,
                optionName: bestReview.option_name,
            };
        });
    }

    /**
     * [M]베스트리뷰 상세 조회
     *
     * @param {number} reviewId: 리뷰ID
     * @returns Promise<{reviewDetail: Review; nextReviewId: number;prevReviewId: number;}
     */
    async bestDetailReview(
        goodsId: number,
        reviewId: number
    ): Promise<{
        reviewDetail: Review;
        nextReviewId: number;
        prevReviewId: number;
    }> {
        const {
            best_review,
            next_best_review_id,
            prev_best_review_id
        } = await this.dataSource.execute<{
            best_review: ReviewResponse,
            next_best_review_id: number,
            prev_best_review_id: number,
        }>(
            "GOODS_DETAIL_BEST_REVIEW",
            {
                goodsId,
                reviewId,
            },
            {}
        );

        return {
            reviewDetail: {
                id: best_review.id,
                contents: best_review.contents,
                isPhotoReview: best_review.is_photo_review,
                rate: best_review.rate,
                optionName: best_review.option_name,
                imageUrls: best_review.image_urls,
                photoCount: best_review.image_urls.length,
                createdAt: best_review.created_at,
                writerGradeImageUrl: best_review.writer_grade_image_url,
                writerId: best_review.writer_masking_id,
                writerGradeLabel: best_review.writer_grade_label,
            },
            nextReviewId: next_best_review_id,
            prevReviewId: prev_best_review_id,
        };
    }

    /**
     * EP 쿠폰 조회
     * @param goodsId : number
     * @returns
     */
    async getEpCoupon(goodsId: number): Promise<EpCoupon> {
        const response = await this.dataSource.execute<{
            epCoupon: EpCouponResponse;
        }>(
            "GOODS_EP_COUPON",
            {
                goodsId,
            },
            {}
        );

        return response.epCoupon
            ? {
                id: response.epCoupon.id,
                discountedAmount: response.epCoupon.discounted_amount,
                discountedPrice: response.epCoupon.discounted_price,
                discountedType: response.epCoupon.discounted_type,
                durationDayCount: response.epCoupon.duration_day_count,
                siteCode: response.epCoupon.site_code,
                siteLabel: response.epCoupon.site_label,
            }
            : null;
    }
    /**
     * 상품상세 기본조회
     * @param {number} goodsId: 상품ID
     * @returns
     */
    async detailBase(goodsId: number): Promise<GoodsBasicInfo> {
        const response = await this.dataSource.execute<ResponseGoodsBasicInfo>(
            'GOODS_DETAIL_BASIC_INFO',
            {
                goodsId: goodsId,
            },
            {}
        );

        const goods: GoodsDetail = {
            id: goodsId,
            name: response.goods.name,
            brandId: response.goods.brand_id,
            brandName: response.goods.brand_name || '',
            sellerId: response.goods.seller_id,
            thumbnailUrl: response.goods.thumbnail_urls[0],
            thumbnailUrls: response.goods.thumbnail_urls,           
            stock: response.goods.stock,
            headline: response.goods.headline,
            isSoldout: response.goods.is_soldout || false,
            isCustomMade: response.goods.is_custom_made,
            isOverSeaDelivery: response.goods.is_oversea_delivery,
            saleReserve: !response.goods.sale_reserve ? undefined : {
                sellStartAt: response.goods.sale_reserve.sell_start_at,
                sellEndAt: response.goods.sale_reserve.sell_end_at,
                shipStartAt: response.goods.sale_reserve.ship_start_at,
                shipEndAt: response.goods.sale_reserve.ship_end_at
            },
            isOnlyAdult: response.goods.is_only_adult,
            degree360ImageUrls: response.goods.degree_360_image_urls,
            type: response.goods.type,
            category: {
                depth1Code: response.goods.category.depth1_category_code,
                depth2Code: response.goods.category.depth2_category_code,
                depth3Code: response.goods.category.depth3_category_code,
                fullLabel: response.goods.category.full_label
            }
        };

        const deliveryInfo: DetailDeliveryInfo = {
            shippingCompany: response.goods.delivery_info.shipping_company,
            shippingCenterName: response.goods.delivery_info.shipping_center_name,
            isConditionalFreeDelivery:
                response.goods.delivery_info.is_conditional_free_delivery,
            price: response.goods.delivery_info.shipping_price,
            isPackageDelivery: response.goods.delivery_info.is_package_delivery,
            isFreeDelivery: response.goods.delivery_info.is_free_delivery,
            conditionalFreePrice: typeCastNumber(response.goods.delivery_info.conditional_free_price, 0),
            extraPrice: response.goods.delivery_info.extra_shipping_price,
            customMadeDeliveryDay: response.goods.custom_made_delivery_day,
            overseaDeliveryMax: response.goods.oversea_delivery_max,
            overseaDeliveryMin: response.goods.oversea_delivery_min,
            exportableMessage: response.goods.delivery_info.today_exportable_message === '시 이전 결제 시 당일 출고됩니다.' ? '' : response.goods.delivery_info.today_exportable_message,
            arrivalProbabilityList: (response.goods.delivery_info.shipping_arrival_probability_list || []).map((probability) => {
                return {
                    averageDate: probability.average_date,
                    probability: probability.probability,
                }
            })
        };
        
        deliveryInfo.arrivalProbability = deliveryInfo.arrivalProbabilityList.length > 1 
            ? deliveryInfo.arrivalProbabilityList[1] 
            : deliveryInfo.arrivalProbabilityList[0] || null;

        const returnDeliveryInfo: ReturnDeliveryInfo = {
            shippingCompany:
                response.goods.return_delivery_info.shipping_company,
            tel: response.goods.return_delivery_info.tel,
            shippingPrice: response.goods.return_delivery_info.return_shipping_price,
            returnAddress: response.goods.return_delivery_info.return_address,
            ceoName: response.goods.return_delivery_info.ceo_name,
            companyName: response.goods.return_delivery_info.company_name
        };

        return {
            goods,
            deliveryInfo,
            returnDeliveryInfo,
            isUseSellerShop: response.goods.is_use_seller_shop,
            giveaways: response.goods.giveaways.map((giveaway) => {
                return {
                    id: giveaway.id,
                    conditionLabel: giveaway.condition_label,
                    name: giveaway.name,
                    imageUrl: giveaway.image_url,
                    startAt: giveaway.start_at,
                    endAt: giveaway.end_at
                }
            }),
            isUseStockNotify: response.goods.is_use_stock_notify,
            raffle: response.raffle === null ? null : {
                id: response.raffle.id
            },
            jointPurchase: response.joint_purchase === null ? null : {
                id : response.joint_purchase.id
            }
        };
    }

    /**
     * 상품 가격 할인 정보
     * @param goodsId 상품 ID
     */
    async promotionPrice(goodsId: number): Promise<GoodsPricePromotion> {
        const response = await this.dataSource.execute<{
            night_sale_amount: number;
            highest_downloadable_coupon_amount: number;
            max_discounted_price: number;
            immediately_sale_amount: number;
            is_downloadable_coupon: boolean;
            purchasable: boolean;
            sell_price: number; // 판매가
            price: number; // 정가
            base_discounted_price: number; // 1차할인가
            sale_rate: number; // 할인율            
            time_sale_amount: number; // 타임특가 할인
            welcome? :{
                discounted_price: number
                sale_amount_type: 'rate'|'KRW',
                sale_amount: number
            }
        }>(
            'GOODS_DETAIL_PROMOTIONS',
            {
                goodsId: goodsId,
            },
            {}
        );

        return {
            isDownloadAbleCoupon: response.is_downloadable_coupon,
            nightDiscountedPrice: response.night_sale_amount,
            couponDiscountedPrice: response.highest_downloadable_coupon_amount,
            immediatelyDiscountedPrice: response.immediately_sale_amount,
            maxDiscountedPrice: response.max_discounted_price,
            purchaseAble: response.purchasable,
            price: response.price,
            sellPrice: response.sell_price,
            baseDiscountedPrice: response.base_discounted_price,
            saleRate: response.sale_rate,
            timeSaleDiscountedPrice: response.time_sale_amount,
            welcome: response.welcome ? 
            {
                discountedPrice: response.welcome?.discounted_price,
                saleAmount: response.welcome?.sale_amount,
                saleAmountType: response.welcome?.sale_amount_type
            } 
            : undefined           
        };
    }

    // test
    /**
     * 상품 상세 > 선택형 리뷰 항목 통계
     * @param goodsId  : 상품 ID
     * @returns
     */

    async optionalReviewStatistics(goodsId: number): Promise<OptionalReviewStatistics[]> {
        const { review_template_list } = await this.dataSource.execute<OptionalReviewStatisticsResponse>(
            'GOODS_DETAIL_REVIEW_STATS',
            {
                goodsId: goodsId
            },
            {}
        );

        return review_template_list.map(item => {
            return {
                id: item.id,
                title: item.title,
                subDivisionList: item.subdivision_list.map(sub => {
                    return {
                        id: sub.id,
                        label: sub.label,
                        selectedCount: sub.selected_count,
                        selectedRate: sub.selected_rate,
                        isHighest: sub.is_highest,
                    }
                }),
            }
        });
    }

    /**
     * 리뷰 통계 & qna 전체 카운트
     * @param goodsId  : 상품 ID
     * @returns
     */
    async aggregateReviewAndQna(
        goodsId: number
    ): Promise<AggregateReviewAndQna> {
        const response = await this.dataSource.execute<{
            reviewer_count: number;
            total_review_count: number;
            review_average_star: number;
            satisfaction: number;
            total_qna_count: number;
            wish_count: number;
        }>(
            'GOODS_DETAIL_AGGREGATE',
            {
                goodsId,
            },
            {}
        );

        return {
            totalWishCount: response.wish_count,
            reviewAverageStars: response.review_average_star,
            totalQnaCount: response.total_qna_count,
            reviewerCount: response.reviewer_count,
            totalReviewCount: response.total_review_count,
            satisfaction: response.satisfaction,
        };
    }
    /**
     * 세트 상품 조회
     * @param {number} goodsId : 상품ID
     * @returns Promise<PackageGoods[]>
     */
    async packageGoods(goodsId: number): Promise<BaseGoods[]> {
        const response = await this.dataSource.execute<{
            goods_packages: {
                goods_id: number;
                base_discounted_price: number;
                name: string;
                is_only_adult: boolean;
                thumbnail_url: string;
                is_soldout: boolean;
                brand_name: string;
                sale_rate: number;
                stock: number;
            }[];
        }>(
            "GOODS_DETAIL_PACKAGES",
            {
                goodsId: goodsId,
            },
            {}
        );

        if (response.goods_packages === null) {
            return [];
        }

        return response.goods_packages.map(function (goods) {
            return {
                id: goods.goods_id,
                baseDiscountedPrice: goods.base_discounted_price,
                name: goods.name,
                stock: goods.stock,
                price: goods.base_discounted_price,
                sellPrice: goods.base_discounted_price,
                isOnlyAdult: goods.is_only_adult,
                thumbnailUrl: goods.thumbnail_url,
                isSoldout: goods.is_soldout,
                brandName: goods.brand_name,
                saleRate: goods.sale_rate,
            };
        });
    }

    /**
     * 브랜드 베스트 상품
     * @param goodsId : 상품 ID
     * @returns
     */
    async bestOfBrand(goodsId: number): Promise<BaseGoods[]> {
        const response = await this.dataSource.execute<{
            brand_best_goods: {
                id: number;
                base_discounted_price: number;
                name: string;
                is_only_adult: boolean;
                thumbnail_url: string;
                is_soldout: boolean;
                brand_name: string;
                stock: number;
                sale_rate: number;
            }[];
        }>(
            "GOODS_DETAIL_BRAND_BEST_GOODS",
            {
                goodsId,
            },
            {}
        );

        if (response.brand_best_goods === null) {
            return [];
        }

        const brandBestGoodsExceptNowGoodsId = response.brand_best_goods.filter((goods) => {
            return goods.id !== goodsId;
        });

        return brandBestGoodsExceptNowGoodsId.map(function (goods) {
            return {
                id: goods.id,
                baseDiscountedPrice: goods.base_discounted_price,
                name: goods.name,
                stock: goods.stock,
                price: goods.base_discounted_price,
                sellPrice: goods.base_discounted_price,
                isOnlyAdult: goods.is_only_adult,
                thumbnailUrl: goods.thumbnail_url,
                isSoldout: goods.is_soldout,
                saleRate: goods.sale_rate,
                brandName: goods.brand_name,
            };
        }).slice(0, 10);
    }

    /**
     * 대표 카테고리 베스트
     * @param goodsId
     * @returns
     */
    async bestOfMainCategory(goodsId: number): Promise<BaseGoods[]> {
        const response = await this.dataSource.execute<{
            category_best_goods: {
                id: number;
                base_discounted_price: number;
                name: string;
                is_only_adult: boolean;
                thumbnail_url: string;
                is_soldout: boolean;
                brand_name: string;
                sale_rate: number;
                stock: number;
            }[];
        }>(
            "GOODS_DETAIL_MAIN_CATEGORY_BEST_GOODS",
            {
                goodsId,
            },
            {}
        );

        if (response.category_best_goods === null) {
            return [];
        }

        const categoryBestGoodsExceptNowGoodsId = response.category_best_goods.filter((goods) => {
            return goods.id !== goodsId;
        });


        return categoryBestGoodsExceptNowGoodsId.map(function (goods) {
            return {
                id: goods.id,
                baseDiscountedPrice: goods.base_discounted_price,
                name: goods.name,
                stock: goods.stock,
                isOnlyAdult: goods.is_only_adult,
                thumbnailUrl: goods.thumbnail_url,
                price: goods.base_discounted_price,
                sellPrice: goods.base_discounted_price,
                isSoldout: goods.is_soldout,
                brandName: goods.brand_name,
                saleRate: goods.sale_rate,
            };
        }).slice(0, 10);
    }
    /**
     * review 데이터 조회
     * @param {number} goodsId : 상품 ID
     * @param {object} filters : 필터 객체
     * @returns
     */
    async fetchReviews(
        goodsId: number,
        filters: {
            page: number;
            perPage: number;
            sort: string;
            onlyPhotoReview: boolean;
        }
    ): Promise<ReviewPaginator> {
        const { paginator } =
            await this.dataSource.execute<ReviewPaginatorResponse>(
                "GOODS_DETAIL_REVIEWS",
                {
                    page: filters.page,
                    page_size: filters.perPage,
                    sort: filters.sort,
                    only_photo_review: filters.onlyPhotoReview,
                    goodsId,
                },
                {}
            );

        return {
            currentPage: paginator.current_page,
            total: paginator.total,
            perPage: paginator.per_page,
            data: paginator.data.map((goodsReview) => {
                const physicalInformation: string[] = []
                
                // 입력된 신체 정보만 노출되도록
                if (goodsReview.height) {
                    physicalInformation.push(goodsReview.height + 'cm');
                }

                if (goodsReview.weight) {
                    physicalInformation.push(goodsReview.weight + 'kg');
                }

                if (goodsReview.shoes_size) {
                    physicalInformation.push(goodsReview.shoes_size + 'mm');
                }

                return {
                    id: goodsReview.id,
                    contents: goodsReview.contents,
                    rate: goodsReview.rate,
                    isPhotoReview: goodsReview.is_photo_review,
                    imageUrls: goodsReview.image_urls,
                    createdAt: goodsReview.created_at,
                    writerGradeImageUrl: goodsReview.writer_grade_image_url,
                    writerGradeLabel: goodsReview.writer_grade_label,
                    writerId: goodsReview.writer_masking_id,
                    photoCount: goodsReview.image_urls.length,
                    optionName: goodsReview.option_name,
                    height: goodsReview?.height,
                    weight: goodsReview?.weight,
                    shoesSize: goodsReview?.shoes_size,
                    isExperienceGroup: goodsReview.is_experience_group,
                    templates: goodsReview.templates.map((template) => {
                        return {
                            id: template.id,
                            title: template.title,
                            selectedLabel: template.selected_label,
                        }
                    }),
                    physical: physicalInformation.join('/'),
                };
            }),
        };
    }

    /**
     * 포토리뷰 상세 조회
     * @param {number} reviewId: 리뷰ID
     * @returns
     */
    async photoDetailReview(
        goodsId: number,
        reviewId: number
    ): Promise<{
        reviewDetail: Review;
        nextReviewId: number;
        prevReviewId: number;
    }> {
        const {
            photo_review,
            prev_review_id,
            next_review_id
        } = await this.dataSource.execute<{
            photo_review: ReviewResponse,
            prev_review_id: number,
            next_review_id: number
        }>(
            "GOODS_DETAIL_PHOTO_REVIEW_DETAIL",
            {
                goodsId,
                reviewId,
            },
            {}
        );

        return {
            reviewDetail: {
                id: photo_review.id,
                contents: photo_review.contents,
                isPhotoReview: true,
                rate: photo_review.rate,
                optionName: photo_review.option_name,
                imageUrls: photo_review.image_urls,
                photoCount: photo_review.image_urls.length,
                createdAt: photo_review.created_at,
                writerGradeImageUrl: photo_review.writer_grade_image_url,
                writerId: photo_review.writer_masking_id,
                writerGradeLabel: photo_review.writer_grade_label,
                physical: '',
            },
            nextReviewId: next_review_id,
            prevReviewId: prev_review_id,
        };
    }

    /**
     * 포토리뷰 리스트
     * @param goodsId
     * @param filters
     * @returns
     */
    async photoReviewList(goodsId: number, page = 1, pageSize = 20): Promise<PhotoReviewPaginator> {
        const { paginator } = await this.dataSource.execute<
            PaginatorResponse<{
                id: number;
                image_url: string;
                writer_masking_id: string;
            }>
        >(
            "GOODS_PHOTO_REVIEWS",
            {
                goodsId: goodsId,
                page: page,
                pageSize: pageSize,
            },
            {}
        );

        return {
            currentPage: paginator.current_page,
            total: paginator.total,
            perPage: paginator.per_page,
            data: paginator.data.map((review) => {
                return {
                    id: review.id,
                    imageUrl: review.image_url,
                    writerId: review.writer_masking_id,
                };
            }),
        };
    }

    /**
     * 상품 Q&A 정보 조회
     * @param {number} goodsId: 상품ID
     * @returns { QnaInfo }
     */
    async goodsQnaInfo(goodsId: number): Promise<QnaInfo> {
        const response = await this.dataSource.execute<{
            goods: {
                id: number;
                name: string;
                brand_name: string;
                thumbnail_url: string;
            };
            seller: {
                name: string;
                tel: string;
            };
        }>(
            "GOODS_DETAIL_QNA_WRITE_INFO",
            {
                goodsId: goodsId,
            },
            {}
        );

        return {
            goods: {
                id: response.goods.id,
                name: response.goods.name,
                brandName: response.goods.brand_name,
                thumbnailUrl: response.goods.thumbnail_url,
            },
            sellerName: response.seller.name,
            sellerTel: response.seller.tel,
        };
    }

    /**
     *  상품상세 -> Q&A 리스트 조회
     * @param {number} goodsId : 상품 ID
     * @param {Object} filters : 필터 객체
     * @returns { Promise<QnaPaginator> }
     */
    async goodsQnaList(
        goodsId: number,
        filters: { page: number; perPage: number;  onlyAnswered: boolean }
    ): Promise<QnaPaginator> {
        const { paginator } =
            await this.dataSource.execute<QnaPaginatorResponse>(
                "GOODS_DETAIL_QNA_LIST",
                {
                    goodsId: goodsId,
                    page: filters.page,
                    page_size: filters.perPage,
                    only_answered: filters.onlyAnswered,
                },
                {}
            );
        return {
            total: paginator.total,
            currentPage: paginator.current_page,
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map((qna) => {
                return {
                    id: qna.id,
                    title: qna.title,
                    contents: qna.contents,
                    createdAt: qna.created_at,
                    isAnswered: qna.is_reply,
                    isEditAble: qna.is_editable,
                    isPrivate: qna.is_private,
                    isReadAble: qna.is_readable,
                    answer: {
                        contents: qna.answer?.contents,
                        createdAt: qna.answer?.created_at,
                    },
                };
            }),
        };
    }

    /**
     * Q&A 저장
     * @param {number} goodsId : 상품 ID
     * @param {object} qnaForm : 문의폼
     */
    async storeGoodsQna(
        goodsId: number,
        qnaForm: {
            title: string;
            qnaTypeCode: number;
            contents: string;
            isPrivate: boolean;
        }
    ) {
        const response = await this.dataSource.execute<void>(
            "GOODS_STORE_QNA",
            {
                goodsId: goodsId,
            },
            {
                title: qnaForm.title,
                sub_type: typeCastNumber(qnaForm.qnaTypeCode),
                contents: qnaForm.contents,
                is_private: qnaForm.isPrivate,
            }
        );
    }

    /**
     * 상품 Q&A 수정
     * @param goodsId 상품 ID
     * @param qnaForm 문의 FORM
     */
    async updateQna(
        goodsId: number,
        qnaForm: {
            id: number;
            title: string;
            contents: string;
            isPrivate: boolean;
        }
    ) {
        await this.dataSource.execute<void>(
            "GOODS_UPDATE_QNA",
            {
                goodsId: goodsId,
                qnaId: qnaForm.id,
            },
            {
                title: qnaForm.title,
                contents: qnaForm.contents,
                is_private: qnaForm.isPrivate,
            }
        );
    }

    /**
     * 상품 qna 삭제처리
     * @param qnaId
     */
    async removeQna(qnaId: number, goodsId: number) {
        const response = await this.dataSource.execute<void>(
            "GOODS_DESTROY_QNA",
            {
                goodsId,
                qnaId,
            },
            {}
        );
    }

    /**
     * 상품 qna 상세보기
     * @param {number} goodsId: 상품ID
     * @param {number} qnaId : 문의 ID
     * @returns
     */
    async showQna(goodsId: number, qnaId: number): Promise<GoodsQnaDetail> {
        const response = await this.dataSource.execute<{
            id: number;
            title: string;
            contents: string;
            type_label: string;
            is_private: boolean;
            goods: {
                id: number;
                name: string;
                seller_name: string;
                seller_tel: string;
                thumbnail_url: string;
            };
        }>(
            "GOODS_SHOW_QNA",
            {
                goodsId,
                qnaId,
            },
            {}
        );

        return {
            id: response.id,
            title: response.title,
            contents: response.contents,
            typeLabel: response.type_label,
            isPrivate: response.is_private,
            goods: {
                id: response.goods.id,
                name: response.goods.name,
                sellerName: response.goods.seller_name,
                sellerTel: response.goods.seller_tel,
                thumbnailUrl: response.goods.thumbnail_url,
            },
        };
    }

    /**
     * 다운로드 가능 쿠폰 조회
     * @returns Promise<DownLoadCoupon[]
     */
    async couponList(goodsId: number): Promise<DownLoadCoupon[]> {
        const response = await this.dataSource.execute<{
            coupons: {
                id: number;
                name: string;
                expiration_date_message: string;
                downloadable: boolean;
                usable_device_labels: string[]
            }[];
        }>(
            'GOODS_DETAIL_DOWNLOADABLE_COUPONS',
            {
                goodsId: goodsId,
            },
            {}
        );

        return response.coupons.map(function (coupon) {
            return {
                id: coupon.id,
                name: coupon.name,
                expirationDateMessage: coupon.expiration_date_message,
                isDownloaded: coupon.downloadable,
                usableDeviceLabels: coupon.usable_device_labels,
            };
        });
    }

    /**
     * 쿠폰 다운로드 처리
     * @param {number[]} couponIds: 쿠폰 ID 배열
     */
    async couponDownLoad(couponIds: number[]) {
        const response = await this.dataSource.execute<void>(
            "GOODS_DETAIL_COUPON_DOWNLOAD",
            {},
            {
                coupon_ids: couponIds,
            }
        );
    }

    /**
     * 좋아요 여부 / 리뷰 작성 가능 여부 조회
     * @param goodsId
     * @returns
     */
    async me(goodsId: number): Promise<{
        wished: boolean;
        writableReview: boolean;
    }> {
        const response = await this.dataSource.execute<{
            is_wished: boolean;
            is_writable_review: boolean;
        }>(
            "GOODS_DETAIL_ME",
            {
                goodsId,
            },
            {}
        );

        return {
            wished: response.is_wished,
            writableReview: response.is_writable_review,
        };
    }     

    /**
     * 재입고 알림 신청 
     * @param {number} goodsId 
     * @param {number} optionId 
     */
    async applyNotify(goodsId: number, optionId: number): Promise<void> {
        await this.dataSource.execute(
            'GOODS_RESTOCK_NOTIFY_APPLY',
            {
                goodsId: goodsId,
                optionId: optionId
            },
            {}
        )
    }   

    /**
     * (상품상세용) 타임어택 정보 조회
     * @param { number } goodsId : 상품 ID
     * @returns { TimeDeal } : 타임딜 정보 객체 프로미스
     */
    async getTimeDealInfo(goodsId: number): Promise<TimeDeal> {
        const response = await this.dataSource.execute<
        {
            time_deal_info: {
                sell_start_at: string;
                sell_end_at: string;
                max_orderable_count: number;
            },
        }>(
            'GOODS_TIME_ATTACK_DETAIL',
            {
                goodsId : goodsId
            },
            {}
        )
        
        return {
            sellStartAt: response.time_deal_info.sell_start_at,
            sellEndAt: response.time_deal_info.sell_end_at,
            maxOrderAbleCount: response.time_deal_info.max_orderable_count            
        }

    }
}

const goodsRepository = new GoodsRepository(new BackendMapper);

export { goodsRepository };
