import { DataSource } from '$/@type';

export default abstract class BaseRepository
{
    /**
     * 데이터 원천경로 : backend, json(file), memory
     * @var DataSource
     */
    public dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }    
}