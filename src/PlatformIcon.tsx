
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const PlatformIcon = (props: {platform: string}) => {
    if (props.platform === "youtube") {
        return <YouTubeIcon />
    } else if(props.platform === "twitter") {
        return <TwitterIcon />
    } else {
        return <HelpOutlineIcon />
    }
}

export default PlatformIcon