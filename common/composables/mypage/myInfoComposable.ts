import { MemberInfo } from "$/@type/member/info"
import { Ref, ref } from "vue"

const passwordChangeModalData: {
    memberInfo: Ref<MemberInfo>
} = {
    memberInfo: ref<MemberInfo>()
}
// 비밀번호 변경 기능
export function usePasswordChange() {
    const setPasswordChangeModalMemberInfo = (memberInfo: MemberInfo) => {
        passwordChangeModalData.memberInfo.value = {
            loginId: memberInfo.loginId,
            phone: memberInfo.phone,
            name: memberInfo.name,
            email: memberInfo.email,
            isEmailReceive: memberInfo.isEmailReceive,
            isSmsReceive: memberInfo.isSmsReceive,
        }
    }
    return {
        setPasswordChangeModalMemberInfo,
        passwordChangeModalData
    }
}