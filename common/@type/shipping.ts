import { Paginator, PaginatorResponse } from ".";
import { ShippingAddress } from "./order/order";


interface SearchAddress {
    zipCode: string;
    jibunAddress: string;
    roadAddress: string
}
interface SearchAddressPaginator extends Paginator<SearchAddress> {}

interface SearchAddressResponsePaginator extends PaginatorResponse<{
    zip_code: string;
    jibun_address: string;
    road_address: string;
}>{}


type ShippingAddressForm = Omit<ShippingAddress, "id">

export type {
    SearchAddress,
    SearchAddressPaginator,
    SearchAddressResponsePaginator,
    ShippingAddressForm
}

