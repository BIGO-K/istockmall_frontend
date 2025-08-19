import { Paginator } from "$/@type";
import { 
    EditableQnaForm, 
    Qna, 
    QnaDetail, 
    QnaForm, 
    QnaOrder, 
    QnaOrderItem, 
    QnaType, 
    SubQnaType 
} from "$/@type/cs/inquiry/qna";
import { useForm } from "$/composables/pageHandler/formComposable";
import { typeCastNumber } from "$/filters";
import { defaultCatch } from "$/functions";
import { mmon } from "$/helper/mmon";
import { qnaRepository } from "$/repository/cs/qnaRepository";
import { computed, ref, watch } from "vue";

/**
 * 1:1 문의 리스트
 * @param initialPage 
 * @returns 
 */
export function useQnaList(initialPage: number = 1) {
    const qnaList = ref<Paginator<Qna>>({
        total: 0,
        currentPage: 1,
        perPage: 20,
        data: [],
    });

    /**
     *  1:1 문의 리스트 조회
     * @param pageNumber 
     */
    async function fetchQnaList(pageNumber: number) {
        try {
            mmon.loading.show();
            qnaList.value = await qnaRepository.getList(pageNumber);
        } catch (e) {
            defaultCatch(e);
        } finally {
            mmon.loading.hide();
        }
    }

    (async () => {
        await fetchQnaList(initialPage);
    })()

    return {
        qnaList,
        fetchQnaList
    }
}

/**
 * 1:1 문의 등록 기능
 * @returns 
 */
export function useQnaCreate() {
    // 문의유형
    const qnaTypes = ref<QnaType[]>([]);
    const selectedQnaTypes = computed<QnaType|null>(() => qnaTypes.value?.find(type => type.code === typeCastNumber(qnaCreateForm.value.type)) || null);
    const qnaSubTypes = computed<SubQnaType[]>(() => selectedQnaTypes.value?.children || []);

    // 문의유형 > 주문 사용 여부
    const isQnaTypeWithOrder = computed<boolean>(() => selectedQnaTypes.value?.isWithOrder || false);

    // 문의 가능 주문/주문상품
    const inquirableOrders = ref<QnaOrder[]>([]);
    const orderItems = computed<QnaOrderItem[]>(() => inquirableOrders.value?.find(order => order.orderId === qnaCreateForm.value.orderId)?.items || [])
    const selectedOrderItems = computed<QnaOrderItem[]>(() => {
        return orderItems.value.filter(item => qnaCreateForm.value.orderItemIds.includes(item.id));
    })

    // 문의 FORM
    const { form: qnaCreateForm } = useForm<QnaForm>(
        {
            type: '',
            subType: '',
            orderId: '',
            orderItemIds: [],
            title: '',
            contents: '',
        },
        {
            rules: {
                'type(1차 문의 유형)': ['required'],
                'subType(2차 문의 유형)': ['required'],
                'orderId(주문 번호)': [],
                'orderItemIds(문의 상품)': [],
                'title(문의 제목)': ['required', 'maxLength:50'],
                'contents(문의 내용)': ['required', 'minLength:10', 'maxLength:2000'],
            },
            messages: {
                'title.required': ':param(을/를) 입력해주세요.',
                'contents.required': ':param(을/를) 입력해주세요.',
                'type.required': ':param(을/를) 선택해주세요.',
                'subType.required': ':param(을/를) 선택해주세요.',
                'orderId.requiredIf': ':param(을/를) 선택해주세요.',
                'orderItemIds.requiredIf': ':param(을/를) 선택해주세요.',
            }
        }
    ); 

    /**
     * 주문상품 선택
     * @param orderItemId 주문상품 ID 
     * @returns 
     */
    function selectOrderItem(orderItemId: number) {
        if (qnaCreateForm.value.orderItemIds.includes(orderItemId)) {
            return;
        }

        qnaCreateForm.value.orderItemIds.push(orderItemId);
    }

    /**
     * 주문상품 선택 취소
     * @param orderItemId 
     * @returns 
     */
    function unselectOrderItem(orderItemId: number) {
        if (!qnaCreateForm.value.orderItemIds.includes(orderItemId)) {
            return;
        }

        qnaCreateForm.value.orderItemIds = qnaCreateForm.value.orderItemIds.filter(itemId => orderItemId != itemId);
    }

    /**
     * 문의 작성 요청
     * @throws Error
     */
    async function store() {
        await qnaCreateForm.value.validate();
        await qnaRepository.store(qnaCreateForm.value);
    }

    /**
     * 문의작성에 필요한 데이터 조회
     * @throws Error
     */
    async function prepareQnaCreate() {
        const [ types, orders ] = await Promise.all([
            qnaRepository.getTypes(),
            qnaRepository.getOrders(),
        ])
        qnaTypes.value = types;
        inquirableOrders.value = orders;

        initiateValidationRules();
    }

    /**
     * 유효성 검사 룰 세팅
     */
    function initiateValidationRules() {
        qnaCreateForm.value.rules?.['type(1차 문의 유형)'].push(`in:${qnaTypes.value.map(type => type.code).join(',')}`);
            
        const concatenatedQnaTypeCodesWithOrder = qnaTypes.value.filter(type => type.isWithOrder).map((type) => String(type.code)).join(',');
        qnaCreateForm.value.rules?.['orderId(주문 번호)'].push(`requiredIf:type,${concatenatedQnaTypeCodesWithOrder}`);
        qnaCreateForm.value.rules?.['orderItemIds(문의 상품)'].push(`requiredIf:type,${concatenatedQnaTypeCodesWithOrder}`);
    }

    // 2차문의유형 리스트 변경시점마다 유효성검사 조건 update
    watch(qnaSubTypes, (to) => {
        if (qnaCreateForm.value.rules) {
            qnaCreateForm.value.rules['subType(2차 문의 유형)'] = ['required', `in:${to.map(type => type.code).join(',')}`]
        }
    });

    return {
        qnaTypes,
        qnaSubTypes,
        inquirableOrders,
        orderItems,
        selectedOrderItems,
        isQnaTypeWithOrder,
        qnaCreateForm,
        selectOrderItem,
        unselectOrderItem,
        store,
        prepareQnaCreate,
    }
}

/** 1:1문의 수정 모달 popup (M) */
const qnaId = ref<number>(0);
export function useQnaEditModal() {
    function setQnaIdToEdit(id: number) {
        qnaId.value = id;
    }
    return {
        qnaId,
        setQnaIdToEdit,
    }
}

/**
 * 1:1 문의 수정 기능
 * @param qnaId 문의 ID
 * @returns 
 */
export function useQnaEdit(qnaId: number) {
    const qna = ref<QnaDetail>({
        id: qnaId,
        title: '',
        contents: '',
        typeLabel: '',
        subTypeLabel: '',
        orderId: '',
        orderedAt: '',
        goodsList: [],
        
    });
    //상품포함 문의 여부
    const hasGoods = computed(() => (qna.value.goodsList || []).length > 0);

    // 문의 수정 FORM
    const { form: qnaEditForm } = useForm<EditableQnaForm>(
        {
            id: qnaId,
            title: '',
            contents: '',
        },
        {
            rules: {
                'title(문의 제목)': ['required', 'maxLength:50'],
                'contents(문의 내용)': ['required', 'minLength:10', 'maxLength:2000'],
            },
            messages: {
                'title.required': ':param(을/를) 입력해주세요.',
                'contents.required': ':param(을/를) 입력해주세요.',
            }
        }
    ); 

    /**
     * 수정할 문의 조회
     * @throws Error
     */
    async function getEditableQna() {
        qna.value = await qnaRepository.get(qnaId);
    }

    /**
     * 문의 수정 FORM 초기값 세팅
     */
    function initiateQnaForm() {
        qnaEditForm.value.contents = qna.value.contents;
        qnaEditForm.value.title = qna.value.title;
    }
    
    /**
     * 문의 수정요청
     * @throws Error
     */
    async function update() {
        await qnaEditForm.value.validate();
        await qnaRepository.update(qnaEditForm.value);
    }

    return {
        qna,
        qnaEditForm,
        hasGoods,
        getEditableQna,
        initiateQnaForm,
        update,
    }
}

/**
 * 1:1 문의 삭제 기능
 * @param onDeleted 
 * @returns 
 */
export function useQnaDelete(onDeleted?: () => void) {
    async function deleteQna(qnaId: number) {
        mmon.bom.confirm(
            "1:1문의를 삭제하시겠습니까?",
            async (isConfirm: boolean) => {
                if (!isConfirm) {
                    return;
                }

                mmon.loading.show();
                try {
                    await qnaRepository.delete(qnaId);
                    mmon.bom.alert("1:1문의가 삭제되었습니다.")
                    if (typeof onDeleted == 'function') {
                        onDeleted();
                    }
                } catch (e) {
                    defaultCatch(e);
                } finally {
                    mmon.loading.hide();
                }
            }
        );
    }
    return {
        deleteQna
    }
}