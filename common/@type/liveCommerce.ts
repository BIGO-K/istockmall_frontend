enum BroadCastType {
    LIVE_WITH_CATCHUP = 0,
    VOD = 1,
    ALL = 2,
    LIVE = 3,
    CATCHUP = 4
}


interface BroadCast {
    currentPage: number;
    totalCount: number;
    nextPage: number|null;
    itemsCount: number;
    items: {
        thumbnails?: {
            url: string;
            isRepresentative: boolean;
        }[],
        broadcastThumbnails?: {
            url: string;
            isRepresentative: boolean;
        }[],
        mainThumbNail: string,
        broadcast: {
            id: string;
            name: string;
            explanation: string;
            typeCode: BroadCastType;
            programmingStartAt: string;
            programmingEndAt: string;
            broadcastStartAt: string;
            broadcastEndAt: string;
            totalDuration: string,
            previewUrl?: string,
            hashTags: string[]
        },
        room?: {
            chatCounter: number;
            incomingCounter: number;
            reactionCounter: number
        }
    }[]
}

export { 
    BroadCastType,
    BroadCast
}
