import _ from 'lodash';
import ICollection from './icollection';
import CollectionsConfig from './collections-config';

class Collections implements ICollection {
    private name: string;
    private collections: any[];
    private config: CollectionsConfig;
    private nextID: number;

    constructor(name: string, collections: any[], config: CollectionsConfig) {
        this.name = name;
        this.collections = collections;
        this.config = config;
        this.nextID = 0;
    }

    updateItem(kind: string, entry: any): void {
        _.each(this.config.persistHandlers, handler => handler.update(this.name, kind, entry));
    };

    pushItem(kind: string, entry: any): void {
        _.each(this.config.persistHandlers, handler => handler.update(this.name, kind, entry));
    };

    uid(): number {
        return ++this.nextID;
    }

    push(kind: string, entry: any): void {
        this.collections.push(_.merge({
            collection: this.name,
            kind: kind
        }, entry));
        this.pushItem(kind, entry);
    }

    kind(kind: string): any[] {
        return _.reduce(this.name, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind) {
                acc.push(item);
            }
            return acc;
        }, []);
    }

    kindUpdate(kind: string, callback: Function): void {
        const all = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind) {
                acc.push(item);
            }
            return acc;
        }, []);
        _.each(all, item => {
            callback(item);
            this.updateItem(kind, item);
        });
    }

    filter(kind: string, filter: Function): any[] {
        return _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
    }

    filterUpdate(kind: string, filter: Function, callback: Function): void {
        const res = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
        _.each(res, item => {
            if (callback) {
                callback(item);
            }
            this.updateItem(kind, item);
        });
    }

    filterOne(kind: string, filter: Function, callback: Function): void {
        const res = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
        callback(res.length === 0 ? null : res[0]);
    }

    filterOneUpdate(kind: string, filter: Function, callback: Function): void {
        const res = _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name && item.kind === kind && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
        callback(res.length === 0 ? null : res[0]);
        this.updateItem(kind, res.length === 0 ? null : res[0]);
    }

    all(): any[] {
        return _.reduce(this.collections, (acc: any[], item: any) => {
            if (item.collection === this.name) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
}

export default Collections;