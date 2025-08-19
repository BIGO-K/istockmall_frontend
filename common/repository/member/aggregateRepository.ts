
import { Aggregates, BenefitAggregates, BenefitAggregatesResponse, OrderAggregates, OrderAggregatesResponse } from '$/@type/member/aggregates';
import { BackendMapper } from '$/dataMapper/backendMapper';
import { typeCastNumber, formatDate } from '$/filters';
import BaseRepository from '$/repository/baseRepository';
import { JsonMapper } from '$/dataMapper/jsonMapper';
import { GradeUpCondition, GradeUpConditionResponse } from '$/@type/member/grade';
import moment from 'moment'

/**
 * 회원 집계정보 레파지토리
 */
class MemberAggregateRepository extends BaseRepository {

    /**
     * 회원 혜택집계 조회
     */
    async getBenefitInfo(): Promise<BenefitAggregates> {
        const { benefits } = await this.dataSource.execute<BenefitAggregatesResponse>(
            "MEMBER_AGGREGATES_BENEFIT",
            {},
            {}
        );

        return {
            point: typeCastNumber(benefits.point),
            couponCount: typeCastNumber(benefits.coupon_count),
        }
    }

    /**
     * 회원 주문집계 조회
     */
    async getOrderInfo(): Promise<OrderAggregates> {
        const { orders } = await this.dataSource.execute<OrderAggregatesResponse>(
            "MEMBER_AGGREGATES_ORDER",
            {
                from_date: moment().subtract(3, 'weeks').format('YYYY-MM-DD'),
                to_date: moment().format('YYYY-MM-DD'),
            },
            {}
        );
        return {
            payReady: {
                count: typeCastNumber(orders.pay_ready.count),
                statusCode: orders.pay_ready.status_code
            },           
            paid: {
                count: typeCastNumber(orders.paid.count),
                statusCode: orders.paid.status_code
            },               
            deliveryReady: {
                count: typeCastNumber(orders.delivery_ready.count),
                statusCode: orders.delivery_ready.status_code
            },    
            deliveryIng: {
                count: typeCastNumber(orders.delivery_ing.count),
                statusCode: orders.delivery_ing.status_code
            },        
            deliveryComplete: {
                count: typeCastNumber(orders.delivery_complete.count),
                statusCode: orders.delivery_complete.status_code
            },   
            purchaseConfirmed: {
                count: typeCastNumber(orders.purchase_confirmed.count),
                statusCode: orders.purchase_confirmed.status_code
            },    
            cancelCount: typeCastNumber(orders.cancel_count),             
            returnCount: typeCastNumber(orders.return_count),             
            exchangeCount: typeCastNumber(orders.exchange_count),           
            refundCount: typeCastNumber(orders.refund_count)   
        }
    }

    /**
     * 회원 등급업 조건 조회
     */
    async getGradeUpCondition(): Promise<GradeUpCondition> {
        const { grade_up_condition } = await this.dataSource.execute<GradeUpConditionResponse>(
            "MEMBER_AGGREGATES_GRADEUP_CONDITION",
            {},
            {}
        );

        return {
            orderAmount: grade_up_condition.order_amount,
            orderCount: grade_up_condition.order_count,
            gradeUpOrderAmountCondition: grade_up_condition.grade_up_order_amount_condition,
            gradeUpOrderCountCondition: grade_up_condition.grade_up_order_count_condition,
            nextGradeName: grade_up_condition.next_grade_name,
            isTopLevel: grade_up_condition.is_top_level,
            gradeUpCalculationPeriodMonth: grade_up_condition.grade_up_calculation_period_month,
        }
    }
}

const memberAggregateRepository = new MemberAggregateRepository(
    new BackendMapper
)

export { memberAggregateRepository }