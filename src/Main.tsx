import React from 'react';
import axios from 'axios';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const youtubebackupApiServer = process.env.REACT_APP_API_URL

class Main extends React.Component {
    state = {
        videos: []
    }

    getVideoList = async (uploadStatus: String, fetchNum: Number) => {
        const path = "video-list"
        const res = await axios.get(youtubebackupApiServer + "/" + path ,{
            params: {
                upload_status: uploadStatus,
                fetch_num: fetchNum
            }
        })
        this.setState({videos: res.data})
    }

    presignedS3 = async (videoId: String) => {
        const path = "presigned-s3url"
        const res = await axios.get(youtubebackupApiServer + "/" + path ,{
            params: {
                video_id: videoId
            }
        })
        return res
    }


    componentDidMount(){
        this.getVideoList("complete", 50)
    }

    render() {
        console.log(this.state.videos)
        
        return (
            <div>
                <ul>
                    { this.state.videos.map((value) => 
                        <li>
                            <div>
                                {value["backupdate"]} : <a href={value["video_url"]}><YouTubeIcon /></a> <span onClick={()=> {this.presignedS3(value["video_id"]).then(x => window.open(x.data.presigned_s3url, '_blank'))}}><CloudDownloadIcon /></span> {value["title"]}
                            </div>
                        </li>    
                    )}
                </ul>
            </div>
        )
    }
}

export default Main;
