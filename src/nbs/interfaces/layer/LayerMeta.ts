/**
 * Meta information for a {@linkcode Layer}.
 */
export default interface LayerMeta {
    /**
     * The name of the layer.
     */
    name: string
};

/**
 * Default {@linkcode LayerMeta} values.
 */
export const defaultLayerMeta: LayerMeta = {
    "name": ""
};
