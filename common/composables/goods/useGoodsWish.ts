import { WishGoodsFolder } from "$/@type/member/wish";
import { wishRepository } from "$/repository/member/wishRepository";

export function useGoodsWish() {
    /** STORE **/

    /** //STORE **/

    /** VARIABLE **/

    /** //VARIABLE **/

    /** FUNC **/
    async function getFolders(): Promise<WishGoodsFolder[]> {
        return await wishRepository.getWishGoodsFolders();
    }
    /** //FUNC **/

    return {
        getFolders
    }
}