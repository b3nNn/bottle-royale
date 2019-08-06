interface IPersistHandler {
    init(options: any): Promise<any>
    push(collection: string, kind: string, entry: any): void
    update(collection: string, kind: string, entry: any): void
    serialize(kind: string, entry: any): void
}

export default IPersistHandler;