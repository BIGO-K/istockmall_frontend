import { Paginator, PaginatorResponse } from "$/@type";
import { 
    WishBrand, 
    WishBrandResponse, 
    WishGoods, 
    WishGoodsFolder, 
    WishGoodsFoldersResponse, 
    WishGoodsInFolder, 
    WishGoodsInFolderResponse, 
    WishGoodsResponse, 
    WishAllBrandsResponse 
} from '$/@type/member/wish';
import { BackendMapper } from "$/dataMapper/backendMapper";
import { JsonMapper } from "$/dataMapper/jsonMapper";
import BaseRepository from "$/repository/baseRepository";
import { typeCastNumber } from '$/filters';
import { LikedBrand } from "$/@type/shopping";
import { useUserState } from "$/composables/auth/userComposable";
import { useLikeStore } from "$/store/like";

class WishRepository extends BaseRepository
{
    /**
     * 찜한 브랜드 최근순 조회 (페이지네이터)
     * 
     * @returns Promise<Paginator<WishBrand>>
     */
    async getBrands(page:number, perPage: number = 28) : Promise<Paginator<WishBrand>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<WishBrandResponse>>(
            'MEMBER_WISH_BRANDS',
            {
                page: page,
                page_size: perPage,
            },
            {}
        )

        return {
            total: typeCastNumber(paginator.total),
            currentPage: typeCastNumber(paginator.current_page),
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map((brand) => {
                return {
                    id: brand.id,
                    name: brand.name,
                    logoImageUrl: brand.logo_image_url,
                }
            })
        }
    }

    /**
     * 찜한 브랜드 리스트 조회
     * 
     * @returns Promise
     */
    async getAllBrands(): Promise<WishBrand[]> {
        const { wish_brands } = await this.dataSource.execute<WishAllBrandsResponse>(
            'MEMBER_WISH_ALL_BRANDS',
            {},
            {}
        );
        
        return wish_brands.map((brands) => {
            return {
                id: brands.id,
                name: brands.name,
                logoImageUrl: brands.logo_image_url,
            }
        })
    }

    /**
     * 찜한 브랜드 추가
     * 
     * @param  {number} brandId
     * @returns Promise
     */
    async addWishBrand(brandId: number): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_STORE_WISH_BRAND',
            {},
            {
                brand_id: brandId,
            }
        )
    }

    /**
     * 찜한 브랜드 삭제
     * 
     * @param  {number} brandId
     * @returns Promise
     */
    async deleteBrand(brandId: number): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_DELETE_WISH_BRAND',
            {},
            {
                brand_id: brandId,
            }
        )
    }

    /**
     * 찜한 상품 폴더 리스트 조회
     * 
     * @returns Promise<WishGoodsFolder[]>
     */
    async getWishGoodsFolders(): Promise<WishGoodsFolder[]> {
        const { wish_goods_folders } = await this.dataSource.execute<WishGoodsFoldersResponse>(
            'MEMBER_WISH_GOODS_FOLDERS',
            {},
            {},
        )

        return wish_goods_folders.map((folder) => {
            return {
                id: folder.id,
                name: folder.name,
                orderSeq: folder.order_seq,
                recordsCount: folder.records_count,
                recentGoodsThumbnailUrl: folder.recent_goods_thumbnail_url,
            }
        })
    }
    
    /**
     * 새 찜한상품 폴더 추가
     * 
     * @param  {string} name
     * @returns Promise
     */
    async addWishGoodsFolder(name: string): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_CREATE_WISH_FOLDER',
            {},
            {
                name: name,
            }
        );
    }

    /**
     * 폴더명 수정
     * @param  {number} folderId
     * @param  {string} name
     * @returns Promise
     */
    async updateWishFolder(folderId: number, name: string): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_UPDATE_WISH_FOLDER',
            {
                folder_id: folderId,
            },
            {
                name: name,
            }
        );
    }

    /**
     * 폴더 순서 수정
     * @param  {WishGoodsFolder[]} folders
     * @returns Promise
     */
    async updateWishGoodsFolderSort(folderSorts: Pick<WishGoodsFolder, "id"|"orderSeq">[]): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_UPDATE_WISH_GOODS_FOLDER_SORT',
            {},
            {
                sorts: folderSorts.filter(sort => sort.id != 0).map((sort) => {
                    return {
                        id: sort.id,
                        order_seq: sort.orderSeq,
                    }
                })
            }
        );
    }

    /**
     * 폴더 삭제
     * @param  {number} folderId
     * @returns Promise
     */
    async deleteWishGoodsFolder(folderId: number): Promise<void> {
        await this.dataSource.execute<void>(
            'MEMBER_DELETE_WISH_GOODS_FOLDER',
            {
                folder_id: folderId
            },
            {}
        );

    }

    /**
     * 폴더별 찜한상품 조회 (페이지네이터)
     * 
     * @param  {number} page
     * @param  {number} folderId
     * @param  {number=50} perPage
     * @returns Promise
     */
    async getWishGoods(page: number, folderId?: number, perPage: number = 50): Promise<Paginator<WishGoods>> {
        const { paginator } = await this.dataSource.execute<PaginatorResponse<WishGoodsResponse>>(
            'MEMBER_WISH_GOODS',
            {
                folder_id: folderId,
                page: page,
                page_size: perPage,
            },
            {},
        );

        return {
            total: typeCastNumber(paginator.total),
            currentPage: typeCastNumber(paginator.current_page),
            perPage: typeCastNumber(paginator.per_page),
            data: paginator.data.map((wishGoods) => {
                return {
                    id: wishGoods.id,
                    name: wishGoods.name,
                    brandName: wishGoods.brand_name,
                    thumbnailUrl: wishGoods.thumbnail_url,
                    baseDiscountedPrice: wishGoods.base_discounted_price,
                    saleRate: wishGoods.sale_rate,
                    isSoldout: wishGoods.is_soldout,
                    price: wishGoods.base_discounted_price,
                    sellPrice: wishGoods.base_discounted_price,
                }
            })
        }
    }

    /**
     * 폴더별 찜한 상품 조회
     * 
     * @param  {number} folderId
     * @returns Promise
     */
    async getWishGoodsInFolder(folderId: number): Promise<WishGoodsInFolder[]> {
        const { wish_goods } = await this.dataSource.execute<WishGoodsInFolderResponse>(
            'MEMBER_WISH_GOODS_IN_FOLDER',
            {
                folder_id: folderId,
            },
            {},
        );

        return wish_goods.map((goods) => {
            return {
                id: goods.id,
                name: goods.name,
                brandName: goods.brand_name,
                thumbnailUrl: goods.thumbnail_url,
                baseDiscountedPrice: goods.base_discounted_price,
                saleRate: goods.sale_rate,
                isSoldout: goods.is_soldout,
                price: goods.base_discounted_price,
                sellPrice: goods.base_discounted_price,
            }
        })
    }

    /**
     * 찜한상품 삭제
     * 
     * @param  {number} goodsIds
     * @returns Promise
     */
    async deleteWishGoods(goodsIds: number[]): Promise<void> {
        const store = useLikeStore();    
        await this.dataSource.execute<void>(
            'MEMBER_DELETE_WISH_GOODS',
            {},
            {
                goods_ids: goodsIds,
            },
        )
        store.removeMultiLikedGoods(goodsIds);
    }

    /**
     * 찜한 상품 수정(폴더이동)
     * 
     * @param  {number[]} goodsIds
     * @param  {number} folderId
     * @returns Promise
     */
    async addWishGoods(goodsId: number, folderId: number): Promise<void> {
        const store = useLikeStore();    
        await this.dataSource.execute<void>(
            'MEMBER_STORE_WISH_GOODS',
            {},
            {
                goods_id: goodsId,
                folder_id: folderId
            },
        )
        store.addLikedGoodsMulti([goodsId]);
    }
    
    /**
     * 찜한 상품 수정(폴더이동)
     * 
     * @param  {number[]} goodsIds
     * @param  {number} folderId
     * @returns Promise
     */
    async updateWishGoods(goodsIds: number[], folderId: number): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_UPDATE_WISH_GOODS",
            {
                goods_ids: goodsIds,
                folder_id: folderId
            },
            {
                goods_ids: goodsIds,
                folder_id: folderId
            },
        )
    }

    /**
     * 브랜드 ID로 좋아요 조회 
     * @param {number[]} brandIds: 브랜드 ID 배열 
     */
    async getWishBrandRelation(brandIds: number[]): Promise<LikedBrand[]> {
        if (brandIds.length < 1) {
            return []
        }
        
        const { isUser } = useUserState();
        
        if (!isUser.value) {
            return brandIds.map(function (brandId) {
                return {
                    brandId: brandId,
                    liked: false
                }
            })
        }

        const response = await this.dataSource.execute<{
            liked_relation_brands: {
                brand_id: number,
                liked: boolean
            }[]
        }>(
            'SHOPPING_WISH_BRANDS',
            {},
            {
                brand_ids: brandIds
            }
        )

        return response.liked_relation_brands.map((likedRelation) => {
            return {
                brandId: likedRelation.brand_id,
                liked: likedRelation.liked
            }
        })

    }
}

const wishRepository = new WishRepository(
    new BackendMapper
)

export { wishRepository }
