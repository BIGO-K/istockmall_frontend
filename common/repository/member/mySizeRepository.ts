import { typeCastBoolean, typeCastNumber } from '$/filters';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { ShoesCategory, ShoesSize } from '$/@type/configs';
import BaseRepository from '$/repository/baseRepository';
import { FilterFit } from '$/@type/searchFilter';
import { MySize } from '$/@type/member/info';
class MySizeRepository extends BaseRepository
{
    /**
     * my 사이즈 조회
     * @returns 
     */
    async getMySize(): Promise<MySize>{
        const { my_size } = await this.dataSource.execute<{
            my_size: {
                gender?: string
                fit_id?: number
                shoes_category_code?: string
                shoes_size_id?: number
                height?: number
                weight?: number
                information_agree?: boolean
            }
        }>(
            "MEMBER_MY_SIZE",
            {},
            {}
        );

        return {
            gender: my_size.gender,
            fitId: my_size.fit_id,
            shoesCategoryCode: my_size.shoes_category_code,
            shoesSizeId: my_size.shoes_size_id,
            height: my_size.height,
            weight: my_size.weight,
            informationAgree: typeCastBoolean(my_size.information_agree),
        }
    }

    /**
     * 신발사이즈 리스트 조회
     * @returns 
     */
    async getShoesSizes(): Promise<ShoesSize[]>{
        const { shoes_sizes } = await this.dataSource.execute<{
            shoes_sizes: {
                id: number
                value: number
                label: string
            }[]
        }>(
            'CONF_SHOES_SIZE',
            {},
            {},
        )

        return shoes_sizes.map(size => {
            return {
                id: size.id,
                value: size.value,
                label: size.label
            }
        })
    }

    /**
     * 신발 카테고리 리스트 조회
     * @returns 
     */
    async getShoesCategories(): Promise<ShoesCategory[]>{
        const { shoes_categories } = await this.dataSource.execute<{
            shoes_categories: {
                code: string
                label: string
            }[]
        }>(
            "CONF_SHOES_CATEGORIES",
            {},
            {}
        );

        return shoes_categories.map(shoesCategory => {
            return {
                code: shoesCategory.code,
                label: shoesCategory.label
            }
        });
    }

    /**
     * My핏 리스트
     * @returns 
     */
    async getFitList(): Promise<FilterFit[]> {
        const { fit_list } = await this.dataSource.execute<{
            fit_list: {
                id: number
                label: string
            }[]
        }>(
            "CONF_FIT_LIST",
            {},
            {}
        );

        return fit_list.map(fit => {
            return {
                id: fit.id,
                label: fit.label
            }
        });
    }

    /**
     * 마이사이즈 수정
     * @param mySizeForm 
     */
    async updateMySize(mySizeForm: MySize): Promise<void> {
        await this.dataSource.execute<void>(
            "MEMBER_MY_SIZE_UPDATE",
            {
                gender: mySizeForm.gender,
                fit_id: mySizeForm.fitId,
                shoes_category_code: mySizeForm.shoesCategoryCode,
                shoes_size_id: mySizeForm.shoesSizeId,
                height: mySizeForm.height,
                weight: mySizeForm.weight,
                information_agree: mySizeForm.informationAgree ? 1 : 0,
            },
            {}
        )
    } 
}

const mySizeRepository = new MySizeRepository(
    new BackendMapper
)

export { mySizeRepository }