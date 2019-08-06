interface ICollection {
    updateItem(kind: string, entry: any): void
    pushItem(kind: string, entry: any): void
    uid(): number
    push(kind: string, entry: any): void
    kind(kind: string): any[]
    kindUpdate(kind: string, callback: Function): void
    filter(kind: string, filter: Function): any[]
    filterUpdate(kind: string, filter: Function, callback: Function): void
    filterOne(kind: string, filter: Function, callback: Function): void
    filterOneUpdate(kind: string, filter: Function, callback: Function): void
    all(): any[]
}

export default ICollection;