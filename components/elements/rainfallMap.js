// Rainfall Map Component - Uses Deck GL Icon Layers to render Component

// Package Imports
import {connect} from "react-redux";
import StaticMap from "react-map-gl";
import _MapContext from "react-map-gl";
import DeckGL from "@deck.gl/react";
import React, {useEffect, useState} from "react";
import {IconLayer} from '@deck.gl/layers';

// Local Imports
import mapIcons from '../../public/images/icons/location-icon-atlas.svg';
import {styled, Box, Typography} from "@mui/material";

// Map Configuration
const mapStyleMapBox1 = 'mapbox://styles/mapbox/streets-v11';
const mapStyleMono = 'mapbox://styles/andyclarke/cl2svmbha002u15pi3k6bqxjn';
const mapStyleMapBox2 = 'mapbox://styles/andyclarke/cl1z4iue1002w14qdnfkb3gjj'
const mapStyleCarto = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const ICON_MAPPING = {
    Student: { x: 384, y: 512, width: 128, height: 128, mask: false, anchorY: 128 },
    Teacher: { x: 256, y: 512, width: 128, height: 128, mask: false, anchorY: 128 },
    School: { x: 128, y: 512, width: 128, height: 128, mask: false, anchorY: 128 },
};

// Street Map Component
const RainfallMap = ({ toggleLanguage, mapBoxToken, updateCarouselCoordinates, mapStylePlain, updatePrimaryLocation }) => {

    const [tooltip, setTooltip] = useState({});

    const iconLayer = new IconLayer({
        id: "icon-layer",
        data: [
            {
                coordinates: [updateCarouselCoordinates.longitude, updateCarouselCoordinates.latitude],
                timestamp: "2022-04-09T13:32:30.745Z",
                type: "Rain Event",
                citizenType: "Student",
                citizenOrganisation: "School in São Paulo",
                submissionText: "It's a dry day here today!"
            },
            {
                coordinates: [updateCarouselCoordinates.longitude + 0.07, updateCarouselCoordinates.latitude + 0.07],
                timestamp: "2022-04-07T13:32:30.745Z",
                type: "Rain Event",
                citizenType: "Teacher",
                citizenOrganisation: "Colégio Humboldt São Paulo",
                submissionText: "Chuva leve a noite toda continua chovendo ainda."
            }
        ],
        pickable: true,
        iconAtlas: mapIcons.src,
        getIcon: (d) => d.citizenType,
        // NOTE ** ITS ONLY POSSIBLE TO HAVE ONE ICON HERE
        iconMapping: ICON_MAPPING,
        sizeScale: 10,
        getPosition: (d) => d.coordinates,
        getSize: (d) => 12,
        onHover: d => setTooltip(d)
    });

    // const initialLongitude = mapStylePlain ? updatePrimaryLocation.location.geo.longitude - 0.07 : updateCarouselCoordinates.longitude - 0.07
    // const initialLatitude = mapStylePlain ? updatePrimaryLocation.location.geo.latitude : updateCarouselCoordinates.latitude

    const INITIAL_VIEW_STATE = {
        longitude: updateCarouselCoordinates.longitude - 0.07,
        latitude: updateCarouselCoordinates.latitude,
        zoom: 5,
        minZoom: 1,
        maxZoom: 50,
        pitch: 0,
        bearing: 0
    };

    const layers = mapStylePlain ? null : [iconLayer]
    const controllerTrue = mapStylePlain ? Boolean(0) : Boolean(1)

    return (
        <DeckGL layers={[layers]} controller={controllerTrue} preventStyleDiffing={true} initialViewState={INITIAL_VIEW_STATE} height={'100%'} width={'100%'} ContextProvider={_MapContext.Provider} >
            <StaticMap
                reuseMaps
                mapStyle={mapStyleMono}
                mapboxAccessToken={mapBoxToken}
            />

            {/*AREA TO CREATE TOOLTIP*/}

            {tooltip.hasOwnProperty('object') ? (
                <MyTooltipBox sx={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: tooltip.x, top: tooltip.y}}>
                    <TooltipFlex>
                        <Box sx={{display: `flex`}}>
                            <TypeOrganisationBox>
                                <Typography sx={{fontSize: `20px`}} >{tooltip.object.citizenType}</Typography>
                                <Typography sx={{fontSize: `14px`, color: (theme) => (theme.palette.primary.main)}}>{tooltip.object.citizenOrganisation}</Typography>
                            </TypeOrganisationBox>
                        </Box>
                        <Typography sx={{fontWeight: (theme) => (theme.typography.fontWeightBold)}}>{tooltip.object.type.toUpperCase()}<span className={"bluePunctuation"}>.</span></Typography>
                    </TooltipFlex>
                    <Typography sx={{fontSize: `20px`, textAlign: `left`, marginTop: (theme) => (theme.spacing(2)), marginBottom: (theme) => (theme.spacing(2))}} >{'"' + tooltip.object.submissionText + '"'}</Typography>
                    <TooltipFlex>
                        <Typography sx={{color: `#888888`}} >{new Date(tooltip.object.timestamp).toLocaleString().split(',')[0]}</Typography>
                    </TooltipFlex>
                </MyTooltipBox>
            ): null}
        </DeckGL>
    );
}

const MyTooltipBox = styled(Box)(({theme}) => ({
    display: `flex`,
    width: `400px`,
    flexDirection: `column`,
    minHeight: `150px`,
    justifyContent: `space-between`,
    backgroundColor: theme.palette.primary.light,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    boxShadow: `0px 0px 15px #E5E5E5`,
    border: `1.5px solid #E5E5E5`,
}))

const TooltipFlex = styled(Box)(({theme}) => ({
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    maxHeight: `60px`
}))

const TypeOrganisationBox = styled(Box)(({theme}) => ({
    display: `flex`,
    flexDirection: `column`,
    justifyContent: `space-around`,
    marginLeft: theme.spacing(0),
}))

export default connect((state) => state)(RainfallMap)