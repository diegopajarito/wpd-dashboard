// Component to Takeover Screen with Adding Location Popover

// Package Imports
import {connect} from "react-redux";
import {Box, styled, Container, Typography, Divider, Alert, AlertTitle, IconButton} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {useEffect, useState} from "react";


// Local Imports
import uiText from "../../data/ui-text";
import Search from "./search";
import {locationColorKeys} from "../../data/colorMapping";
import LocationControlButton from "./locationControlButton";
import ThematicIllustration from "./thematicIllustration";

// Adding Location Window Component
const AddingLocationWindow = ({ toggleLanguage, updateAdditionalLocation, updatePrimaryLocation, addingLocationStatusHandler }) => {

    const threshold = locationColorKeys.length;

    const [thresholdReached, setThresholdReached] = useState(false);

    useEffect(() => {
        updateAdditionalLocation.locations.length >= threshold ? setThresholdReached(true) : setThresholdReached(false)
    }, [updateAdditionalLocation.locations.length, threshold])

    const returnPopoverLayout = () => {
        if (thresholdReached) {
            return (
                <>
                    <MyAlert severity={"info"}>
                        <AlertTitle sx={{textAlign: `left`}}>{uiText.global.labels.tooManyLocationsTitle[toggleLanguage.language]}</AlertTitle>
                        <Typography sx={{textAlign: `left`}}>{uiText.global.labels.tooManyLocationsDescription[toggleLanguage.language]}</Typography>
                    </MyAlert>
                </>
            )
        } else {
            return (
                <>
                    <Search addingLocation={true}/>
                </>
            )
        }
    }


    return (
        <AddingLocationWindowContainer >
            <WindowOverlay className={"window-overlay"}/>
            <PopoverBox>
                <MyCancelIconButton onClick={addingLocationStatusHandler}>
                    <CancelIcon color={"primary"}/>
                </MyCancelIconButton>
                <Box sx={{position: `absolute`, top: `5px`, left: `5px`, zIndex: `-1`, width: `50%`}}>
                    <ThematicIllustration renderOne={true}/>
                </Box>
                <Typography variant={'h5'} sx={{fontWeight: (theme) => (theme.typography.fontWeightBold)}}>{uiText.global.labels.addNewLocation[toggleLanguage.language].toUpperCase()}<span className={'bluePunctuation'}>.</span></Typography>
                {returnPopoverLayout()}
                <SelectedLocationsBox>
                    <Typography sx={{paddingBottom: `10px`, fontWeight: (theme) => (theme.typography.fontWeightBold)}}>{uiText.global.labels.selectedLocations[toggleLanguage.language].toUpperCase()}<span className={'bluePunctuation'}>.</span></Typography>
                    <Divider sx={{width: `100%`}}/>
                    <LocationControlBox>
                        <LocationButtonLayoutBox>
                            <LocationControlButton primary={true} data={updatePrimaryLocation.location} contained={false} color={'#2196F3'}/>
                        </LocationButtonLayoutBox>
                        {updateAdditionalLocation.locations.length > 0 ? updateAdditionalLocation.locations.map((item, index) => {

                            return (
                                <LocationButtonLayoutBox key={index}>
                                    <LocationControlButton primary={false} data={item} contained={false} color={locationColorKeys[index].color}/>
                                </LocationButtonLayoutBox>
                            )
                        }) : null}
                    </LocationControlBox>
                </SelectedLocationsBox>
            </PopoverBox>
        </AddingLocationWindowContainer>
    );
}

const AddingLocationWindowContainer = styled(Container)(({theme}) => ({
    position: `absolute`,
    display: `flex`,
    width: `100vw`,
    height: `100vh`,
    justifyContent: `centre`
}))

const WindowOverlay = styled(Box)(({theme}) => ({
    position: `fixed`,
    top: `0`,
    right: `0`,
    opacity: `.5`,
    zIndex: `3000`,
    width: `100vw`,
    height: `100vh`,
    backgroundColor: `#888888`,
}))


const PopoverBox = styled(Box)(({theme}) => ({
    position: `fixed`,
    marginLeft: `auto`,
    marginRight: `auto`,
    top: `25%`,
    left: 0,
    right: 0,
    textAlign: `center`,
    opacity: `1`,
    zIndex: `3001`,
    width: `55%`,
    minHeight: `55%`,
    borderRadius: theme.shape.borderRadius,
    filter: `drop-shadow(0px 0px 15px rgba(33, 150, 243, 0.35))`,
    border: `1.5px solid #2196F3`,
    padding: theme.spacing(6),
    backgroundColor: theme.palette.primary.light,
}))

const SelectedLocationsBox = styled(Box)(({theme}) => ({
    position: `absolute`,
    zIndex: `500`,
    top: 200,
    right: theme.spacing(6),
    left: theme.spacing(6),
    width: `auto`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `flex-start`,
    paddingTop: theme.spacing(6),
}))

const MyAlert = styled(Alert)(({theme}) => ({
    marginTop: theme.spacing(4)
}))

const LocationControlBox = styled(Box)(({theme}) => ({
    padding: `0px 0 20px 0`,
    display: `flex`,
    flexWrap: `wrap`,
    gap: `5px 20px`,
    width: `100%`,
}))

const LocationButtonLayoutBox = styled(Box)(({theme}) => ({
    marginTop: theme.spacing(2.5),
}))

const MyCancelIconButton = styled(IconButton)(({theme}) => ({
    position: `absolute`,
    zIndex: 1000,
    opacity: 1,
    top: -10,
    left: -10,
    height: `auto`,
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(0.25)
}))

export default connect((state) => state)(AddingLocationWindow)