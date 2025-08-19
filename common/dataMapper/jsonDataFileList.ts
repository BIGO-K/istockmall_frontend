interface JsonFileItem {
  name: string;
  getFileData: Function;
}

//
const jsonFilesList: Array<JsonFileItem> = [
  {
    name: "AUTH_LOGIN",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/user.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_EDIT_INFO",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/userInfo.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_MAIN_BANNERS",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/mainBanner.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_CATEGORY_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/categoryGoods.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_GOODS_REVIEW",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/goodsReviewList.json");
      return fileData.default;
    },
  },
  {
    name: "CS_GRADE_BENEFIT_INFO",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/grade.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_ALL_CATEGORY_LIST",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/categoryList.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_RECENT_VIEW_GOODS",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/recentViewGoods.json");
      return fileData.default;
    },
  },
  {
    name: "ADD_CART_GOODS",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/addCartResult.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_CART_GOODS",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/cartList.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_CART_GOODS_OPTIONS",
    getFileData: async function fileReading(): Promise<[]> {
      const fileData = await import("../fakeFile/cartGoodsOptionList.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_REVIEWS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/review.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_WISH_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/wishGoods.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_RECENT_VIEW_GOODS_PAGINATOR",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import(
        "../fakeFile/recentViewGoodsPaginator.json"
      );
      return fileData.default;
    },
  },
  {
    name: "FETCH_RECENT_VIEW_PLANNING",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/recentViewPlanning.json");
      return fileData.default;
    },
  },
  {
    name: "CS_QNA_TYPES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/qnaTypes.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_QNA_ORDERS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/qnaOrders.json");
      return fileData.default;
    },
  },
  {
    name: "CS_FAQ_TYPES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/faqTypes.json");
      return fileData.default;
    },
  },
  {
    name: "CS_FAQ_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/faqs.json");
      return fileData.default;
    },
  },
  {
    name: "CS_TOP_NOTICES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/topNotices.json");
      return fileData.default;
    },
  },
  {
    name: "CS_NOTICE_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/noticeList.json");
      return fileData.default;
    },
  },
  {
    name: "CS_IMPORTANT_NOTICES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/importantNotices.json");
      return fileData.default;
    },
  },
  {
    name: "CS_NOTICE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/notice.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_FIND_ID",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/findIdResult.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_SEND_VERIFICATION_CODE_EMAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_SEND_VERIFICATION_CODE_PHONE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_FIND_PASSWORD",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/passwordFindResult.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_VERIFY_CODE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_CHANGE_PASSWORD",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_SEND_UNMASKED_ID_EMAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "AUTH_SEND_UNMASKED_ID_EMAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_BASIC_KEYWORDS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/basicSearchKeyword.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CHANGE_PASSWORD",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CHECK_DUPLICATE_EMAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_WITHDRAW_REASONS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/withdrawReason.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_WITHDRAW",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_COUPON_REGIST_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/couponRegists.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_COUPON_USABLE_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/couponRange.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_COUPON_USABLE_BRANDS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/couponRange.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_REGIST_COUPON",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "CONF_POINT_RULE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/pointUseRule.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_POINT_HISTORY",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/pointHistory.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_REFUND_ACCOUNT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/memberRefundAccount.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CREATE_OR_UPDATE_REFUND_ACCOUNT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_DELETE_REFUND_ACCOUNT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "CONF_BANK_CODES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/bankCodes.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_DELETE_WISH_BRAND",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_WISH_BRANDS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/wishBrand.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_WISH_ALL_BRANDS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/wishAllBrands.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_WISH_GOODS_FOLDERS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/wishGoodsFolders.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_WISH_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/wishGoods.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_WISH_GOODS_IN_FOLDER",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/wishGoodsInFolder.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_DELETE_WISH_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CREATE_WISH_FOLDER",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_UPDATE_WISH_FOLDER",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_UPDATE_WISH_GOODS_FOLDER_SORT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_DELETE_WISH_GOODS_FOLDER",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_UPDATE_WISH_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_STORE_WISH_BRAND",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_QNA",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/editableQna.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_UPDATE_QNA",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_DELETE_QNA",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_ADD_RECENT_VIEW_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_RECENT_VIEW_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/recentViewGoods.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_ADD_RECENT_VIEW_PLANNING",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_RECENT_VIEW_PLANNINGS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/recentViewPlanning.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_AGGREGATES_BENEFIT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/memberAggregate.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_AGGREGATES_ORDER",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/memberAggregate.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_AGGREGATES_GRADEUP_CONDITION",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/gradeConditions.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_SELLER_QNA_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/sellerQnas.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_REVIEW_WRITABLES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/reviewWritables.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_REVIEW",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/editableReview.json");
      return fileData.default;
    },
  },
  {
    name: "EXH_PLANNING_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/planning.json");
      return fileData.default;
    },
  },
  {
    name: "EXH_PLANNING_COMMENTS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/planning.json");
      return fileData.default;
    },
  },
  {
    name: "CREATE_EXH_PLANNING_COMMENT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "UPDATE_EXH_PLANNING_COMMENT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "DELETE_EXH_PLANNING_COMMENT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "EXH_PLANNING_GROUP_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/planning.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_ORDER_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/normalOrder.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_ORDER_STATUS_CODES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/normalOrder.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_SELLER_QNA_WRITABLE_ORDER_ITEMS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/sellerQnas.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_CANCEL_CANCELABLES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/cancelOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_RETURN_RETURNABLE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/returnOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_EXCHANGE_ADDITIONAL_PAYMENTS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/exchangeOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_EXCHANGE_EXCHANGEABLE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/exchangeOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_CANCEL_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/cancelOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_RETURN_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/returnOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_EXCHANGE_LIST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/exchangeOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_EXCHANGE_SWITCH_RETURNABLE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/exchangeOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_EXCHANGE_SWITCH_RETURN_REFUND_INFO",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/exchangeOrder.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/orderDetail.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_CANCEL_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/orderDetail.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_RETURN_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/orderDetail.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_RECEIPT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/orderDetail.json");
      return fileData.default;
    },
  },
  {
    name: "CODY_SHOT_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/codyShots.json");
      return fileData.default;
    },
  },
  {
    name: "MAIN_RECENT_CODY_SHOTS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/codyShotSimpleList.json");
      return fileData.default;
    },
  },
  {
    name: "MAIN_CODY_SHOTS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/codyShotSimplePaginator.json");
      return fileData.default;
    },
  },
  {
    name: "CODY_SHOT_CATEGORIES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/codyShotCategories.json");
      return fileData.default;
    },
  },
  {
    name: "PARTNERSHIP_INQUIRY_TYPES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/partnershipInquiry.json");
      return fileData.default;
    },
  },
  {
    name: "PARTNERSHIP_INQUIRY_CATEGORIES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/partnershipInquiry.json");
    },
  },
  {
    name: "MAIN_SPECIAL_EVENT",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/eventsMain.json");

      return fileData.default;
    },
  },
  {
    name: "SPECIAL_EVENT_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/eventDetailPC.json");

      return fileData.default;
    },
  },
  {
    name: "SPECIAL_EVENT_GROUP_GOODS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/eventGoodsList.json");
      return fileData.default;
    },
  },
  {
    name: "SPECIAL_EVENT_COMMENTS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/eventReviews.json");
      return fileData.default;
    },
  },
  {
    name: "BLOCK_PAGE",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/block.json");
      return fileData.default;
    },
  },
  {
    name: "BLOCK_BLOCK",
    getFileData: async function fileReading(): Promise<object> {
      // const fileData = await import("../fakeFile/reco_p_n=w12Xh9_s9.json");
      const fileData = await import(
        "../fakeFile/new_p_n=w12Xh7_s4_pagination.json"
      );
      return fileData.default;
    },
  },
  {
    name: "BLOCK_TEST",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/block1.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CLAIM_DELIVERY_DELAY_REPORTABLE_ORDER_ITEMS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/claimReport.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CLAIM_DELIVERY_DELAY_REPORTED_ORDER_ITEMS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/claimReportResult.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CLAIM_DELIVERY_DELAY_REWARD_INFO",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/claimReport.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CLAIM_SOLDOUT_CANCEL_REPORTABLE_ORDER_ITEMS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/claimReport.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CLAIM_SOLDOUT_CANCEL_REWARD_INFO",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/claimReport.json");
      return fileData.default;
    },
  },
  {
    name: "MEMBER_CLAIM_SOLDOUT_CANCEL_REPORTED_ORDER_ITEMS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/claimReportResult.json");
      return fileData.default;
    },
  },
  {
    name: "RANKING_BRAND",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/rankingBrand.json");
      return fileData.default;
    },
  },
  {
    name: "RANKING_ITEM",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/rankingItem.json");
      return fileData.default;
    },
  },
  {
    name: "CONF_INITIAL_SETTINGS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/initialConfigs.json");
      return fileData.default;
    },
  },
  {
    name: "FETCH_MAIN_POPUPS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/mainPopup.json");
      return fileData.default;
    },
  },
  {
    name: "TIME_DEAL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/timeDeals.json");
      return fileData.default;
    },
  },
  {
    name: "MAIN_RAFFLES",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/raffles.json");
      return fileData.default;
    },
  },
  {
    name: "RAFFLE_WINNERS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/raffleWinners.json");
      return fileData.default;
    },
  },
  {
    name: "SHOPPING_CART_ITEMS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/renewalSellerCart.json");
      return fileData.default;
    },
  },
  {
    name: "SPOT_THEME_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/spotTheme.json");
      return fileData.default;
    },
  },
  {
    name: "RAFFLE_ENTRY",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/successOrError.json");
      return fileData.default;
    },
  },
  {
    name: "RAFFLES_ENDED",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/raffles.json");
      return fileData.default;
    },
  },
  {
    name: "ORDER_EXCHANGE_DETAIL",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/orderDetail.json");
      return fileData.default;
    },
  },
  {
    name: "MAIN_TOP_BANNERS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/topBanner.json");
      return fileData.default;
    },
  },
  {
    name: "MAIN_WING_BANNERS",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/topBanner.json");
      return fileData.default;
    },
  },
  {
    name: "EXHIBIT_CATEGORY",
    getFileData: async function fileReading(): Promise<object> {
      const fileData = await import("../fakeFile/exhibitCategory.json");
      return fileData.default;
    },
  },
];
export default jsonFilesList;
