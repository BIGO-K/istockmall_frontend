import { PackResponse } from "./order/order";

type CartOptions = {
    option_id: number;
    ea: number;
};

interface LikedGoods {
    goodsId: number;
    liked: boolean;
}

interface LikedBrand {
    brandId: number;
    liked: boolean;
}

interface CartPack {
    brandId: number;
    brandName: string;
    cartId: number;
    ea: number;
    optionId: number;
    optionStock: number;
    optionName: string;
    optionExtraAmount: number;
    goodsId: number;
    goodsName: string;
    goodsHeadline?: string;
    goodsThumbnailUrl: string;
    goodsSellPrice: number;
    goodsBaseDiscountedPrice: number;
    goodsStock: number;
    goodsType: string;
    isSoldout: boolean;
    likedRelationIndex: number;
    sellerId: number;
    sellerName: string;
}

interface Cart {
    items: CartPack[];
    shippingPrice: number;
    shippingPricePolicy: number;
    shippingRuleTitle?: string;
    conditionalFreeFrom: number;
    extraShippingPrice: number;
    isChargeOnEach: boolean;
}

type CartPackResponse = Omit<PackResponse, "items" | "shipping_rule_id" | "condition_amount"> & {
    items: {
        cart_id: number;
        ea: number;
        brand_id: number;
        brand_name: string;
        goods_base_discounted_price: number;
        goods_id: number;
        goods_name: string;
        goods_headline?: string;
        goods_sell_price: number;
        goods_stock: number;
        goods_thumbnail_url: string;
        goods_type: string;
        option_id: number;
        option_name: string;
        option_extra_amount: number;
        option_stock: number;
        is_soldout: boolean;
        seller_id: number;
        seller_name: string;
    }[];
    is_charge_on_each: boolean;
};

interface CartGoodsOption {
    name: string;
    soldout: boolean;
    sub: Options[];
}

interface Options {
    code: number;
    name: string;
    qty: number;
    price?: number;
    soldout: boolean;
}

interface CartOptionsResponse {
    options: CartGoodsOption[];
}

export { CartPack, CartOptions, Cart, CartPackResponse, LikedGoods, LikedBrand };
