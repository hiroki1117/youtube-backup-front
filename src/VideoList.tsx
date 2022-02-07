import React from 'react';
import {Link} from "react-router-dom";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {ListGroup} from 'react-bootstrap';
import PlatformIcon from './PlatformIcon';

interface Props {
    videos: Array<any>,
    handleIconClick: MyFunction,
    handleDownloadClick: MyFunction
}

type MyFunction = (v: string) => void

const VideoListGroup: React.FC<Props> = (props) => {

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }
    
    const videoList = props.videos.map((video) =>
        <ListGroup.Item key={video["video_id"]} action className="m-1">
            <div>
                {video["backupdate"]} :
                <span onClick={() => {props.handleIconClick(video["video_url"])}}><PlatformIcon platform={video["platform"]} /></span>
                {video["upload_status"] === "complete" &&
                <span onClick={() => props.handleDownloadClick(video["video_id"])}><CloudDownloadIcon /></span>
                }
                <Link to={"/" + video["video_id"]} style={linkStyle}>
                    <div>{video["title"]}</div>
                </Link>
            </div>
        </ ListGroup.Item>
    )

    return (
        <ListGroup>
            {videoList}
        </ListGroup>
    )
}

export default VideoListGroup