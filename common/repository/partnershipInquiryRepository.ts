import { JsonMapper } from '$/dataMapper/jsonMapper';
import { PartnershipInquiry, PartnershipInquiryCategory, PartnershipInquiryType } from '$/@type/partnershipInquiry';
import { BackendMapper } from '$/dataMapper/backendMapper';
import BaseRepository from '$/repository/baseRepository';
class PartnershipInquiryRepository extends BaseRepository
{
    /**
     * 제휴문의 구분 코드/라벨 리스트 조회
     * @returns 
     */
    async getTypes(): Promise<PartnershipInquiryType[]> {
        const { partnership_inquiry_types } = await this.dataSource.execute<{
            partnership_inquiry_types: {
                code: number
                label: string
                description: string
                category_required: boolean
            }[]
        }>(
            "PARTNERSHIP_INQUIRY_TYPES",
            {},
            {}
        );

        return partnership_inquiry_types.map(inquiryType => {
            return {
                code: inquiryType.code,
                label: inquiryType.label,
                description: inquiryType.description,
                categoryRequired: inquiryType.category_required,
            }
        });
    }

    /**
     * 제휴문의 카테고리 리스트 조회
     * @param inquiryTypeCode 
     * @returns 
     */
    async getCategories(inquiryTypeCode: number): Promise<PartnershipInquiryCategory[]> {
        const { partnership_inquiry_categories } = await this.dataSource.execute<{
            partnership_inquiry_categories: {
                code: number
                name: string
            }[]
        }>(
            "PARTNERSHIP_INQUIRY_CATEGORIES",
            {
                type_code: inquiryTypeCode,
            },
            {}
        );

        return partnership_inquiry_categories.map(category => {
            return {
                code: category.code,
                name: category.name,
            }
        })
    }

    /**
     * 제휴문의 메일 발송
     * @param inquiry 제휴문의
     */
    async sendPartnershipInquiry(inquiry: PartnershipInquiry): Promise<void>{
        await this.dataSource.execute(
            "SEND_PARTNERSHIP_INQUIRY",
            {
                inquiry_type: inquiry.type,
                categories: inquiry.categories,
                company_name: inquiry.companyName,
                brand_name: inquiry.brandName,
                name: inquiry.name,
                email: inquiry.email,
                phone: inquiry.phone,
                contents: inquiry.contents
            },
            {}
        );
    }
}

const partnershipInquiryRepository = new PartnershipInquiryRepository(
    new BackendMapper
);

export { partnershipInquiryRepository }