import { BackendMapper } from '$/dataMapper/backendMapper';
import { JsonMapper } from '$/dataMapper/jsonMapper'
import BaseRepository from '$/repository/baseRepository'
import { typeCastBoolean, typeCastNumber } from '$/filters';
import { ShippingAddress } from '$/@type/order/order';
import { SearchAddressResponsePaginator, SearchAddressPaginator, ShippingAddressForm } from '$/@type/shipping';


class ShippingRepository extends BaseRepository {

    /**
     * 회원 배송지 조회 
     * @returns 
     */
    async getReceiveAddresses(): Promise<ShippingAddress[]> {
        const response = await this.dataSource.execute<{ receive_addresses : {
            id: number,
            shipping_name: string,
            name: string,
            tel: string,
            zip_code: string,
            base_address: string,
            detail_address: string,
            is_recent: boolean,
        }[]}>(
            'MEMBER_RECEIVE_ADDRESS',
            {},
            {}
        )

        return response.receive_addresses.map(function (address) {
            return {
                id: address.id,
                shippingName: address.shipping_name,
                name: address.name,
                zipCode: address.zip_code,
                tel: address.tel,
                baseAddress: address.base_address,
                isRecent: address.is_recent,
                detailAddress: address.detail_address             
            }
        })
    }
    /**
     * 주소 검색 API 
     * @param keyword : 검색어
     * @param filters : 필터 조건
     * @returns 
     */
    async findAddress(filters: {  keyword: string, page: number, perPage: number }): Promise<SearchAddressPaginator> {

        const { paginator } = await this.dataSource.execute<SearchAddressResponsePaginator>(
            'SEARCH_ADDRESS',
            {
                page: filters.page,
                page_size: filters.perPage,
                keyword: filters.keyword
            },
            {}
        )
        
        return {            
            currentPage: paginator.current_page,
            total: typeCastNumber(paginator.total),
            perPage: paginator.per_page,
            data: paginator.data.map((address) => {
                return {
                    zipCode : address.zip_code,
                    jibunAddress : address.jibun_address,
                    roadAddress : address.road_address,
                }
            })
        }
    }

    /**
     * 배송지 등록 처리 
     * @param {ShippingAddressForm} receiveAddress: 배송지 등록객체!
     */
    async registAddress(receiveAddress: ShippingAddressForm) {
        const response = await this.dataSource.execute<void>(
            'MEMBER_STORE_RECEIVE_ADDRESS',
            {},
            {
                shipping_name: receiveAddress.shippingName,
                name: receiveAddress.name,
                tel: receiveAddress.tel,
                zip_code: receiveAddress.zipCode,
                base_address: receiveAddress.baseAddress,
                detail_address: receiveAddress.detailAddress
            }
        )
    }

    /**
     * 배송지 삭제 처리 
     * @param id : 배송지 ID
     */
    async removeAddress(id: number) {
        if (isNaN(id)) {
            return;
        }

        const response = await this.dataSource.execute<void> (
            'MEMBER_DELETE_RECEIVE_ADDRESS',
            {
                address_id: id
            },
            {}
        );
    }

    async isExtraAreaCheck(zipCode: string, roadAddress: string): Promise<boolean> {
        const response = await this.dataSource.execute<{
            is_extra_area: boolean
        }> (
            'ADDRESS_EXTRA_AREA_CHECK',
            {},            
            {
                zip_code: zipCode,
                address: roadAddress
            }
        );

        return response.is_extra_area;
    }
}

const shippingRepository = new ShippingRepository(
    new BackendMapper
)

export {
    shippingRepository
}