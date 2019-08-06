import _ from 'lodash';
import CollectionsConfig from './collections-config';
import CollectionsBuilder from './collections-builder';

const CollectionsProvider = (options: any): Function => {
    const config = new CollectionsConfig(options);
    const collections: any[] = [];
    const builder = new CollectionsBuilder(collections, config)

    return builder.build;
}

export default CollectionsProvider;