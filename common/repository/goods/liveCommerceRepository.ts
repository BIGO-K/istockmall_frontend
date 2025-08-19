import { BroadCast, BroadCastType } from "$/@type/liveCommerce";
import BaseRepository from "$/repository/baseRepository";
import { BackendMapper } from '$/dataMapper/backendMapper';

class LiveCommerceRepository extends BaseRepository {   
    /**
     * 방송 목록 조회 하기 
     */
    async getBroadCastsByType(
        limit: number, 
        searchType: BroadCastType, 
        nextPage?: number
    ): Promise<BroadCast> {
        const response = await this.dataSource.execute<{
            total_count: number,
            next_page: number|null,
            items_count: number,
            items: [
                {
                    thumbnails: {
                        url: string,
                        is_representative: boolean
                    }[],
                    broadcast_thumbnails: {
                        url: string,
                        is_representative: boolean
                    }[],
                    broadcast: {
                        id: string,
                        name: string,
                        explanation: string,
                        type_code: BroadCastType,
                        programming_start_at: string,
                        programming_end_at: string,
                        broadcast_start_at: string,
                        broadcast_end_at: string,
                        total_duration: number,
                        preview_url: string,
                        hash_tags: string[]
                    },
                    room: {
                        chat_counter: number,
                        incoming_counter: number,
                        reaction_counter: number
                    }
                }
            ]
        }>(
            'GET_ACTIVE_BROAD_CAST',
            {
                return_limit: limit,
                broadcast_type: searchType,
                next_page: nextPage || null
            },
            {}
        )
        
        return {
            currentPage: 1,
            totalCount: response.total_count,
            nextPage: response.next_page,
            itemsCount: response.items_count,
            items: response.items.map((item) => {
                return {                 
                    mainThumbNail: getMainThumbNail(item.broadcast_thumbnails),
                    thumbnails: item.thumbnails?.map((thumbnail) => {
                        return {
                            url: thumbnail.url,
                            isRepresentative: thumbnail.is_representative
                        }
                    }),
                    broadcastThumbnails: item.broadcast_thumbnails?.map((broadCast) => {
                        return {
                            url: broadCast.url,
                            isRepresentative: broadCast.is_representative
                        }
                    }),
                    broadcast: {
                        id: item.broadcast.id,
                        name: item.broadcast.name,
                        explanation: item.broadcast.explanation,
                        typeCode: item.broadcast.type_code,
                        programmingStartAt: item.broadcast.programming_start_at,
                        programmingEndAt: item.broadcast.programming_end_at,
                        broadcastStartAt: item.broadcast.broadcast_start_at,
                        broadcastEndAt: item.broadcast.broadcast_end_at,
                        totalDuration: timeToFormatHMS(item.broadcast.total_duration),
                        hashTags: item.broadcast.hash_tags,
                        previewUrl: item.broadcast.preview_url
                    },
                    room: {
                        chatCounter: item.room.chat_counter,
                        incomingCounter: item.room.incoming_counter,
                        reactionCounter: item.room.reaction_counter
                    }
                    
                }
            }) 
        }
    }

    async getScheduleBroadCasts(limit: number, nextPage?: number) {
        const response = await this.dataSource.execute<{
            total_count: number,
            next_page: number|null,
            items_count: number,
            items: [
                {
                    thumbnails: {
                        url: string,
                        is_representative: boolean
                    }[],                    
                    broadcast_thumbnails: {
                        url: string,
                        is_representative: boolean
                    }[],
                    broadcast: {
                        id: string,
                        name: string,
                        explanation: string,
                        type_code: BroadCastType,
                        programming_start_at: string,
                        programming_end_at: string,
                        broadcast_start_at: string,
                        broadcast_end_at: string,
                        total_duration: number,
                        hash_tags: string[]
                    },
                    room: {
                        chat_counter: number,
                        incoming_counter: number,
                        reaction_counter: number
                    }
                }
            ]
        }>(
            'GET_SCHEDULE_BROAD_CAST',
            {
                next_page: nextPage || null,
                return_limit: limit,
            },
            {}
        )
        
        return {
            currentPage: 1,
            totalCount: response.total_count,
            nextPage: response.next_page,
            itemsCount: response.items_count,
            items: response.items.map((item) => {
                return {      
                    mainThumbNail: getMainThumbNail(item.broadcast_thumbnails),              
                    thumbnails:  item.thumbnails.map((thumbnail) => {
                        return {
                            url: thumbnail.url,
                            isRepresentative: thumbnail.is_representative
                        }
                    }),
                    broadcastThumbnails: item.broadcast_thumbnails.map((broadCast) => {
                        return {
                            url: broadCast.url,
                            isRepresentative: broadCast.is_representative
                        }
                    }),
                    broadcast: {
                        id: item.broadcast.id,
                        name: item.broadcast.name,
                        explanation: item.broadcast.explanation,
                        typeCode: item.broadcast.type_code,
                        programmingStartAt: item.broadcast.programming_start_at,
                        programmingEndAt: item.broadcast.programming_end_at,
                        broadcastStartAt: item.broadcast.broadcast_start_at,
                        broadcastEndAt: item.broadcast.broadcast_end_at,
                        totalDuration: timeToFormatHMS(item.broadcast.total_duration),
                        hashTags: item.broadcast.hash_tags
                    }                    
                }
            }) 
        }
    }
}


function getMainThumbNail( thumbnails: {
    url: string,
    is_representative: boolean
}[]) {
    if (thumbnails.length < 1) {
        return ''
    }

    return thumbnails.find((thumbnail) => {
        return thumbnail.is_representative
    })?.url || thumbnails[0].url
}

function timeToFormatHMS(diffInMs: number) {

    const hour =  Math.floor(diffInMs / 3600);
    const minute =  Math.floor(diffInMs % 3600 / 60);
    const second = Math.floor(diffInMs % 60);

    //연산한 값을 화면에 뿌려주는 코드
    return `${padTimeFormat(hour)}:${padTimeFormat(minute)}:${padTimeFormat(second)}`
}

function padTimeFormat(time: number) {
    return time < 10 ? `0${time}` : time
}
    



const liveCommerceRepository = new LiveCommerceRepository(
    new BackendMapper
)

export { liveCommerceRepository }