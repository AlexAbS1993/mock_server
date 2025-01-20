export interface Handler<DataType, ReturnType> {
    execute(data: DataType): ReturnType
}