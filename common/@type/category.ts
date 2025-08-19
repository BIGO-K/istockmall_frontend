interface Category {
    code: string;
    parentCode?: string;
    name: string;
    imageUrl?: string;
    fullPath?: string;
    mobileBannerImageUrl: string;
    mobileBannerAlt: string;
    pcBannerImageUrl: string;
    pcBannerAlt: string;
    childCategoryList?: Category[];
}

interface CategoryResponse {
    code: string;
    parentCode?: string;
    name: string;
    image_url?: string;
    full_path?: string;
    mobile_top_image_url: string;
    mobile_top_alt: string;
    pc_top_image_url: string;
    pc_top_alt: string;
    children?: ChildCategoryResponse[];
}

interface ChildCategoryResponse {
    code: string;
    parentCode?: string;
    name: string;
    image_url?: string;
    full_path?: string;
    mobile_top_image_url: string;
    mobile_top_alt: string;
    pc_top_image_url: string;
    pc_top_alt: string;
    children?: ChildCategoryResponse[];
}

interface CategoryResponseList {
    category_list: CategoryResponse[];
}

export { Category, CategoryResponseList };
