import { typeCastBoolean, typeCastNumber } from "$/filters";
import {
	BannerPartition,
	BannerPartitionResponse,
	GoodsGroupResponse,
	GoodsGroup,
} from "$/@type/block/partition";
import { BackendMapper } from "$/dataMapper/backendMapper";
import {
	Block,
	BlockResponse,
	Container,
	ContainerResponse,
} from "$/@type/block";
import BaseRepository from "$/repository/baseRepository";
import { http, makePath } from "$/services/http";
import moment from 'moment';
import { JsonMapper } from "$/dataMapper/jsonMapper";

class BlockRepository extends BaseRepository {
  /**
   * 블록 페이지단위 조회
   * @param  {string} pageName
   * @returns Promise
   */
	async getPage(pageName?: string): Promise<Container[]> {
		const { containers } = await this.dataSource.execute<{
			containers: ContainerResponse[];
		}>(
			'BLOCK_PAGE',
			{
				page_name: pageName,
			},
			{}
		);
		
		return containers.map((container) => {
			const blocks: Block[] = container.blocks.map((block) => {
				const tabs: Block['tabs'] = (block.tabs || []).map((tab) => {
					return {
						id: tab.id || 0,	// 내사이즈블록 >> 내사이즈 탭은 id 없음
						title: tab.title,
						bannerPartition: tab.banner_partition
							? this.formatBannerPartition(tab.banner_partition)
							: undefined,
						goodsGroup: tab.goods_group
							? this.formatGoodsGroup(tab.goods_group)
							: undefined,
					};
				});

				const bannerPartition: Block['bannerPartition'] = block.banner_partition
					? this.formatBannerPartition(block.banner_partition)
					: undefined;

				const goodsGroup: Block['goodsGroup'] = block.goods_group
					? this.formatGoodsGroup(block.goods_group)
					: undefined;

				const jointPurchasePartition: Block['jointPurchasePartition'] = block.joint_purchase_partition ? {
					currentPage: block.joint_purchase_partition.current_page,
					pagingUrl: block.joint_purchase_partition.paging_url,
					perPage: block.joint_purchase_partition.per_page,
					total: block.joint_purchase_partition.total,
					jointPurchaseList: block.joint_purchase_partition.joint_purchase_list.map((jointPurchase) => {
						return {
							id: jointPurchase.id,
							jointPurchasePrice: jointPurchase.joint_purchase_price,
							participantCount: jointPurchase.participant_count,
							targetCount: jointPurchase.target_count,
							isTargetAchieve: jointPurchase.is_target_achieve,
							targetAt: jointPurchase.target_at,
							targetAchieveRate: jointPurchase.target_achieve_rate,
							goods: {
								id: jointPurchase.goods.id,
								name: jointPurchase.goods.name,
								thumbnailUrl: jointPurchase.goods.thumbnail_url,
								brandId: jointPurchase.goods.brand_id,
								brandName: jointPurchase.goods.brand_name || '',
								brandLogoImageUrl: jointPurchase.goods.brand_logo_image_url,
								price: jointPurchase.goods.price,
								sellPrice: jointPurchase.goods.sell_price,
								baseDiscountedPrice: jointPurchase.goods.base_discounted_price,
								saleRate: jointPurchase.goods.sale_rate,
								isSoldout: typeCastBoolean(jointPurchase.goods.is_soldout),
								isOnlyAdult: jointPurchase.goods.is_only_adult,
							}
						}
					})
				} : undefined

				const rafflePartition: Block['rafflePartition'] = block.raffle_partition ? {
					currentPage: block.raffle_partition.current_page,
					pagingUrl: block.raffle_partition.paging_url,
					perPage: block.raffle_partition.per_page,
					total: block.raffle_partition.total,
					raffleList: block.raffle_partition.raffle_list.map(raffle => {
						return {
							id: raffle.id,
							availableDeviceList: raffle.available_device_list ?? [], // 'M_APP', 'M_WEB', 'PC'
							startAt: raffle.start_at,
							endAt: raffle.end_at,
							noticeAt: raffle.notice_at,
							buyStartAt: raffle.buy_start_at,
							buyEndAt: raffle.buy_end_at,
							totalEntryCount: raffle.total_entry_count,
							isEntry: raffle.is_entry,
							isConfirmedWinner: raffle.is_confirmed_winner,
							isStart: moment().diff(raffle.start_at, 'seconds') > 0,
							isEnd: moment().diff(raffle.end_at, 'seconds') > 0,
							isNotice: moment().diff(raffle.notice_at, 'seconds') > 0,
							isBeforeBuyStart: moment().diff(raffle.buy_start_at, 'seconds') > 0,
							isBuyEnd: moment().diff(raffle.buy_end_at, 'seconds') > 0,
							goods: {
								id: raffle.goods.id,
								name: raffle.goods.name,
								brandName: raffle.goods.brand_name || '',
								thumbnailUrl: raffle.goods.thumbnail_url,
								isSoldout: raffle.goods.is_soldout ?? false,
								isOnlyAdult: raffle.goods.is_only_adult ?? false,
								baseDiscountedPrice: raffle.goods.base_discounted_price,
								saleRate: raffle.goods.sale_rate,
								sellPrice: raffle.goods.sell_price,
								price: raffle.goods.price,
							}
						};
					})
				} : undefined

				const liveCommercePartition = block.live_commerce_partition ? {
					liveCommerceList: block.live_commerce_partition.live_commerce_list.map(liveCommerce => {
						return {
							isOnAir: liveCommerce.is_on_air,
							mainThumbnail: (liveCommerce.broadcast_thumbnails || []).length <  1 ? '' : 
								(liveCommerce.broadcast_thumbnails || []).find((thumbnail) => {
									return thumbnail.is_representative
								})?.url || (liveCommerce.broadcast_thumbnails || [])[0]?.url || ''
							,
							thumbnails: (liveCommerce.thumbnails || []).map(thumbnail => {
								return {
									url: thumbnail.url,
									isRepresentative: thumbnail.is_representative,
								}	
							}),
							broadcastThumbnails: (liveCommerce.broadcast_thumbnails || []).map(broadcastThumbnail => {
								return {
									url: broadcastThumbnail.url,
									isRepresentative: broadcastThumbnail.is_representative,
								}	
							}),
							broadcastId: liveCommerce.broadcast_id,
							broadcastTypeCode: liveCommerce.broadcast_type_code,
							broadcastName: liveCommerce.broadcast_name,
							programmingStartAt: liveCommerce.programming_start_at,
							broadcastStartAt: liveCommerce.broadcast_start_at,
							previewUrl: liveCommerce.preview_url,
						}
					})
				} : undefined;

				return {
					id: block.id,
					name: block.mui_code,
					title1: block.title_1,
					title2: block.title_2,
					link: block.link,
					designTitleClassName: block.design_title_class_name || "",
					existsMyFit: typeCastBoolean(block.exist_my_fit),
					rankHasRange: typeCastBoolean(block.rank_has_range),
					tabs: tabs,
					bannerPartition: bannerPartition,
					goodsGroup: goodsGroup,
					jointPurchasePartition: jointPurchasePartition,
					rafflePartition: rafflePartition,
					liveCommercePartition: liveCommercePartition,
				};
			});
			
			return {
				id: container.id,
				blocks: blocks,
			};
		});
	}


	/**
	 *
	 * @param pagingUrl
	 * @param page
	 * @param perPage
	 * @returns
	 */
	async getBannerPaginator(
		pagingUrl: string,
		page: number,
		perPage: number
	): Promise<Block["bannerPartition"]> {
		const endpoint = makePath(pagingUrl, {
		page: page,
		per_page: perPage,
		});

		const { banner_partition } = await http.get<
			{},
			{ banner_partition: BlockResponse["banner_partition"] }
		>(endpoint);

		return this.formatBannerPartition(banner_partition);
	}

	/**
	 *
	 * @param pagingUrl
	 * @param page
	 * @param perPage
	 * @returns
	 */
	async getGoodsGroupPaginator(
		pagingUrl: string,
		page: number,
		perPage: number
	): Promise<Block["goodsGroup"]> {
		const endpoint = makePath(pagingUrl, {
			page: page,
			per_page: perPage,
		});

		const response = await http.get(endpoint);
		return this.formatGoodsGroup(response.data as BlockResponse["goods_group"]);
	}

	/**
	 * @param  {BannerPartitionResponse} bannerPartition
	 * @returns BannerPartition
	 */
  	private formatBannerPartition(bannerPartition: BannerPartitionResponse): BannerPartition {
		return {
			currentPage: typeCastNumber(bannerPartition.current_page),
			total: typeCastNumber(bannerPartition.total),
			perPage: typeCastNumber(bannerPartition.per_page),
			pagingUrl: bannerPartition.paging_url || "",
			banners: bannerPartition.banners.map((banner) => {
				return {
					id: banner.id,
					imageUrl: banner.image_url,
					alt: banner.alt,
					goodsGroup: banner.goods_group
						? this.formatGoodsGroup(banner.goods_group)
						: undefined,
					link: banner.link,
					text1: banner.text_1,
					text2: banner.text_2,
					text3: banner.text_3,
					text4: banner.text_4,
					isUseText: typeCastBoolean(banner.is_use_text),
					displayStartAt: banner.display_start_at,
					displayEndAt: banner.display_end_at,
					createdAt: banner.created_at,
					colorCode: banner.text_color,
				};
			}),
		};
  	}

	/**
	 * @param  {GoodsGroupResponse} goodsGroup
	 * @returns GoodsGroup
	 */
  	private formatGoodsGroup(goodsGroup: GoodsGroupResponse): GoodsGroup {
		return {
			text1: goodsGroup.text_1,
			text2: goodsGroup.text_2,
			text3: goodsGroup.text_3,
			currentPage: typeCastNumber(goodsGroup.current_page),
			total: typeCastNumber(goodsGroup.total),
			perPage: typeCastNumber(goodsGroup.per_page),
			pagingUrl: goodsGroup.paging_url || "",
			goodsList: (goodsGroup.goods_list || []).map((goods) => {
				return {
					id: goods.id,
					name: goods.name,
					brandName: goods.brand_name || '',
					thumbnailUrl: goods.thumbnail_url,
					isOnlyAdult: typeCastBoolean(goods.is_only_adult),
					isUseStockNotify: typeCastBoolean(goods.is_use_stock_notify),
					price: goods.price,
					sellPrice: goods.sell_price,
					baseDiscountedPrice: goods.base_discounted_price,
					saleRate: goods.sale_rate,
					stock: typeCastNumber(goods.stock),
					isSoldout: typeCastBoolean(goods.is_soldout),
					mouseOverImageUrl: goods.mouse_over_image_url || "",
					icon: !goods.icon
						? undefined
						: {
							backgroundColor: goods.icon.background_color_code || '',
							textColor: goods.icon.font_color_code || '',
							label: goods.icon.label || '',
						},
					badges: goods.badges || [],
					headline: goods.headline,
					orderCount: typeCastNumber(goods.order_count),
					wishCount: typeCastNumber(goods.wish_count),
					reviewCount: typeCastNumber(goods.review_count),
					reviewScoreAverage: typeCastNumber(goods.review_score_average),
					rank: goods.rank,
					rankChangeType: goods.rank_change_type,
					rankChangeValue: typeCastNumber(goods.rank_change_value),
				};
			}),
		};
	}
}

const blockRepository = new BlockRepository(  
  new BackendMapper
);

export { blockRepository };
