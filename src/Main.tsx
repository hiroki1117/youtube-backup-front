import React from 'react';
import axios from 'axios';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Button from '@mui/material/Button';

const youtubebackupApiServer = process.env.REACT_APP_API_URL

class Main extends React.Component {
    state = {
        videos: [],
        searchValue: ""
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

    handleChange = (event: any) => {
        this.setState({searchValue: event.target.value})
    }

    handleSubmit = async (event: any) => {
        const path = "video-info"
        const res = await axios.get(youtubebackupApiServer + "/" + path ,{
            params: {
                video_id: this.state.searchValue
            }
        }).then(result => {
            console.log(result.data)
            alert(JSON.stringify(result.data))
        })
    }

    componentDidMount(){
        this.getVideoList("complete", 50)
    }

    render() {
        console.log(this.state.videos)
        
        return (
            <div>
                <div>
                    <input type="text" value={this.state.searchValue} onChange={this.handleChange} /><input type="submit" value="検索" onClick={this.handleSubmit}/>
                </div>
                <ul>
                    { this.state.videos.map((value) => 
                        <li>
                            <div>
                                {value["backupdate"]} : 
                                <span onClick={()=> window.open(value["video_url"])}><YouTubeIcon /></span> <span onClick={()=> {this.presignedS3(value["video_id"]).then(x => window.open(x.data.presigned_s3url, '_blank'))}}><CloudDownloadIcon /></span> {value["title"]}
                            </div>
                        </li>    
                    )}
                </ul>
                <Button variant="outlined" onClick={()=> this.getVideoList("complete", this.state.videos.length+50)}>more</Button>
            </div>
        )
    }
}

export default Main;
