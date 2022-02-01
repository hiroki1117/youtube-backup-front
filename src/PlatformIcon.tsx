
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const PlatformIcon = (platform: string) => {
    if (platform == "youtube") {
        return <YouTubeIcon />
    } else if(platform == "twitter") {
        return <TwitterIcon />
    } else {
        return <HelpOutlineIcon />
    }
}

export default PlatformIcon