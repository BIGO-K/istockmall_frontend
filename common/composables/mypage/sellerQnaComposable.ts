import { Paginator } from "$/@type";
import { QnaOrderItem } from "$/@type/cs/inquiry/qna";
import { EditableSellerQnaForm, SellerQna, SellerQnaDetail, SellerQnaForm, SellerQnaType } from "$/@type/cs/inquiry/sellerQna";
import { Seller } from "$/@type/goods";
import { useForm } from "$/composables/pageHandler/formComposable";
import { useModal } from "$/composables/pageHandler/modalComposable";
import { defaultCatch } from "$/functions";
import { mmon } from "$/helper/mmon";
import { sellerQnaRepository } from "$/repository/cs/sellerQnaRepository";
import { Component, Ref, computed, ref } from "vue";

/**
 * 판매자 문의 리스트
 * @param initialPage 
 * @returns 
 */
export function useSellerQnaList(initialPage: number = 1) {
    const sellerQnaList = ref<Paginator<SellerQna>>({
        total: 0,
        currentPage: 1,
        perPage: 20,
        data: [],
    });

    /**
     * 판매자 문의 리스트 조회
     * @param pageNumber 
     */
    async function fetchSellerQnaList(pageNumber: number) {
        try {
            mmon.loading.show();
            sellerQnaList.value = await sellerQnaRepository.getList(pageNumber);
        } catch (e) {
            defaultCatch(e);
        } finally {
            mmon.loading.hide();
        }
    }

    (async () => {
        await fetchSellerQnaList(initialPage)
    })()

    return {
        sellerQnaList,
        fetchSellerQnaList
    }
}

/**
 * 판매자 문의 등록 기능
 * @param orderId 
 * @param sellerId 
 * @param onCompleted 
 * @returns 
 */
export function useSellerQnaCreate(orderId: string, sellerId: number) {
    // 문의유형
    const sellerQnaTypes = ref<SellerQnaType[]>([]);

    // 문의 가능 주문/주문상품
    const inquirableOrderItems = ref<QnaOrderItem[]>([])
    const selectedOrderItems = computed<QnaOrderItem[]>(() => {
        return inquirableOrderItems.value.filter(item => sellerQnaCreateForm.value.orderItemIds.includes(item.id));
    })

    // 문의 FORM
    const { form: sellerQnaCreateForm } = useForm<SellerQnaForm>(
        {
            type: '',
            orderId: orderId,
            orderItemIds: [],
            title: '',
            contents: '',
            isPrivate: false,
        },
        {
            rules: {
                'orderId(주문번호)': ['required'],
                'orderItemIds(주문상품)': ['required'],
                'type(문의 유형)': ['required', 'minValue:1'],
                'title(문의 제목)': ['required', 'maxLength:50'],
                'contents(문의 내용)': ['required', 'minLength:10', 'maxLength:2000'],
            },
            messages: {
                'orderId.required': ':param(을/를) 선택해주세요.',
                'orderItemIds.required': ':param(을/를) 선택해주세요.',
                'type.required': ':param(을/를) 선택해주세요.',
                'type.minValue': ':param(을/를) 선택해주세요.',
                'type.in': ':param(이/가) 유효하지 않습니다.',
                'title.required': ':param(을/를) 입력해주세요.',
                'contents.required': ':param(을/를) 입력해주세요.',
            }
        }
    ); 

    /**
     * 주문상품 선택
     * @param orderItem 
     * @returns 
     */
    function selectOrderItem(orderItemId: number) {
        if (sellerQnaCreateForm.value.orderItemIds.includes(orderItemId)) {
            return;
        }

        sellerQnaCreateForm.value.orderItemIds.push(orderItemId);
    }

    /**
     * 주문상품 선택 취소
     * @param orderItemId 
     * @returns 
     */
    function unselectOrderItem(orderItemId: number) {
        if (!sellerQnaCreateForm.value.orderItemIds.includes(orderItemId)) {
            return;
        }

        sellerQnaCreateForm.value.orderItemIds = sellerQnaCreateForm.value.orderItemIds.filter(itemId => orderItemId != itemId);
    }

    /**
     * 문의 작성 요청
     * @throws Error
     */
    async function store() {
        await sellerQnaCreateForm.value.validate();
        await sellerQnaRepository.store(sellerQnaCreateForm.value);
    }

    /**
     * 문의작성에 필요한 데이터 조회 및 validation 룰 데이터 세팅
     * @throws Error
     */
    async function prepareSellerQnaCreate() {
        const [ types, orderItems ] = await Promise.all([
            sellerQnaRepository.getTypes(),
            sellerQnaRepository.getWritableOrderItems(orderId, sellerId),
        ]);

        sellerQnaTypes.value = types;
        inquirableOrderItems.value = orderItems;

        sellerQnaCreateForm.value.rules?.['type(문의 유형)'].push(`in:${sellerQnaTypes.value.map(type => type.code).join(',')}`);
    }

    return {
        sellerQnaTypes,
        inquirableOrderItems,
        selectedOrderItems,
        sellerQnaCreateForm,
        selectOrderItem,
        unselectOrderItem,
        store,
        prepareSellerQnaCreate,
    }
}

/**
 * 판매자 문의 등록 modal
 * @param modalComponent 
 */
export function useSellerQnaCreateModal(modalComponent: Component) {
    /**
     * 판매자 문의 등록 모달 열기
     * @param {string} orderId 주문번호
     * @param {Seller} seller 셀러정보 
     */
    function open(orderId: string, seller: Seller) {
        useModal().open(modalComponent, {
            title: '판매자 문의하기',
            name: 'SellerQnaModal',
            itemClass: 'm_modal-inquiry',
            props: () => ({
                seller,
                orderId,
            }),
        })
    }

    return {
        open
    }
}

/** 판매자문의 등록 모달 popup (M) */
const sellerQnaModalData: {
    orderId: Ref<string>
    seller: Ref<Seller>
} = {
    orderId: ref<string>(''),
    seller: ref<Seller>({
        id: 0,
        name: '',
        tel: '',
    })
}
export function useSellerQnaCreateModalPopup() {
    function setSellerQnaModalData(orderId: string, seller: Seller) {
        sellerQnaModalData.orderId.value = orderId;
        sellerQnaModalData.seller.value = seller;
    }

    return {
        sellerQnaModalData,
        setSellerQnaModalData
    }
}

/** 판매자문의 수정 모달 popup (M) */
const sellerQnaId = ref<number>(0);
export function useSellerQnaEditModalPopup() {
    /**
     * 판매자문의 모달데이터 SET
     * @param qnaId 판매자문의 ID
     */
    function setSellerQnaModalData(qnaId: number) {
        sellerQnaId.value = qnaId;
    }

    return {
        sellerQnaId,
        setSellerQnaModalData
    }
}

/**
 * 판매자 문의 수정 기능
 * @param qnaId 문의 ID
 * @param closeEditPage 문의 수정 페이지 닫기 
 * @returns 
 */
export function useSellerQnaEdit(qnaId: number) {
    const sellerQna = ref<SellerQnaDetail>({
        seller: {
            name: '',
            tel: '',
        },
        id: qnaId,
        title: '',
        contents: '',
        typeLabel: '',
        orderId: '',
        orderedAt: '',
        goodsList: [],
        isPrivate: false,
    });

    // 문의 수정 FORM
    const { form: sellerQnaEditForm } = useForm<EditableSellerQnaForm>(
        {
            id: qnaId,
            title: '',
            contents: '',
            isPrivate: false
        },
        {
            rules: {
                'title(문의 제목)': ['required', 'maxLength:30'],
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
     * @param qnaId 문의 ID
     */
    async function getEditableSellerQna() {
        sellerQna.value = await sellerQnaRepository.get(qnaId);
    }
    /**
     * 문의 수정 FORM 초기값 세팅
     */
    function initiateSellerQnaForm() {
        sellerQnaEditForm.value.title = sellerQna.value.title;
        sellerQnaEditForm.value.contents = sellerQna.value.contents;
        sellerQnaEditForm.value.isPrivate = sellerQna.value.isPrivate;
    }
    
    /**
     * 문의 수정요청
     * @throws
     */
    async function update() {
        await sellerQnaEditForm.value.validate();
        await sellerQnaRepository.update(sellerQnaEditForm.value);
    }

    return {
        sellerQna,
        sellerQnaEditForm,
        getEditableSellerQna,
        initiateSellerQnaForm,
        update,
    }
}

/**
 * 판매자 문의 삭제 기능
 * @param onDeleted 
 * @returns 
 */
export function useSellerQnaDelete(onDeleted?: () => void) {
    async function deleteSellerQna(qnaId: number) {
        mmon.bom.confirm(
            "문의를 삭제하시겠습니까?",
            async (isConfirm: boolean) => {
                if (!isConfirm) {
                    return;
                }

                mmon.loading.show();
                try {
                    await sellerQnaRepository.delete(qnaId);
                    mmon.bom.alert("문의가 삭제되었습니다.")
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
        deleteSellerQna
    }
}