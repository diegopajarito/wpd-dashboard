// Cluster Layer Configuration


// Package Imports
import {CompositeLayer} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';
import Supercluster from 'supercluster';
import scaleColorKeys from "../../data/rainfallScaleColorMapping";

function getIconName(size) {
    if (size === 0) {
        return '';
    }
    if (size < 10) {
        return `marker-${size}`;
    }
    if (size < 100) {
        return `marker-${Math.floor(size / 10)}0`;
    }
    return 'marker-100';
}

function getIconSize(size) {
    return Math.min(100, size) / 100 + 1;
}

export default class IconClusterLayer extends CompositeLayer {
    shouldUpdateState({changeFlags}) {
        return changeFlags.somethingChanged;
    }

    updateState({props, oldProps, changeFlags}) {
        const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

        if (rebuildIndex) {
            const index = new Supercluster({maxZoom: 16, radius: props.sizeScale * Math.sqrt(2)});
            index.load(
                props.data.map(d => ({
                    geometry: {coordinates: props.getPosition(d)},
                    properties: d
                }))
            );
            this.setState({index});
        }

        const z = Math.floor(this.context.viewport.zoom);
        if (rebuildIndex || z !== this.state.z) {
            this.setState({
                data: this.state.index.getClusters([-180, -85, 180, 85], z),
                z
            });
        }
    }

    getPickingInfo({info, mode}) {

        const pickedObject = info.object && info.object.properties;
        if (pickedObject) {
            if (pickedObject.cluster && mode !== 'hover') {
                info.objects = this.state.index
                    .getLeaves(pickedObject.cluster_id, 25)
                    .map(f => f.properties);
            }
            info.object = pickedObject;
        }
        return info;
    }

    renderLayers() {
        const {data} = this.state;
        const {iconAtlas, iconMapping, sizeScale} = this.props;


        return this.getSubLayerProps().id === "pluviometer-icon-cluster-sublayer" ? new IconLayer(
            this.getSubLayerProps({
                id: 'icon',
                data,
                iconAtlas,
                iconMapping,
                sizeScale,
                getColor: (d) => d.properties.hasOwnProperty('color') ? d.properties.color : '#888888',
                getPosition: d => d.geometry.coordinates,
                getIcon: d => getIconName(d.properties.cluster ? d.properties.point_count : 1),
                getSize: d => getIconSize(d.properties.cluster ? 150 : 150),
                sizeMinPixels: 50,
                sizeUnits: `meters`,
            })
        ) : new IconLayer(
            this.getSubLayerProps({
                id: 'icon',
                data,
                iconAtlas,
                iconMapping,
                sizeScale,
                getColor: (d) => d.properties.hasOwnProperty('color') ? d.properties.color : '#888888',
                getPosition: d => d.geometry.coordinates,
                getIcon: d => getIconName(d.properties.cluster ? d.properties.point_count : 1),
                getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
            })
        );
    }
}