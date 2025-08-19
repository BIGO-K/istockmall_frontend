import { BaseGoods, BaseResponseGoods } from "$/@type/goods";
import { BasePlanning, BasePlanningResponse } from "$/@type/planning";
import { ExcludeOptional } from "$/@type/index";

type RecentViewGoods = ExcludeOptional<BaseGoods>;

type RecentViewPlanning = Pick<BasePlanning, "id" | "title"> & {
    isEnded: boolean;
};

interface RecentViewGoodsResponse {
    recent_view_goods: (
        Pick<BaseResponseGoods, "id" | "name" | "thumbnail_url" | "base_discounted_price" | "sale_rate"> & {
            is_soldout: NonNullable<BaseResponseGoods["is_soldout"]>;
            brand_name: NonNullable<BaseResponseGoods["brand_name"]>;
        }
    )[];
}

interface RecentViewPlanningsResponse {
    recent_view_plannings: (
        Pick<BasePlanningResponse, "id" | "title"> & {
            is_ended: boolean;
        }
    )[];
}

export type {
    RecentViewGoods,
    RecentViewPlanning,
    RecentViewGoodsResponse,
    RecentViewPlanningsResponse,
};
