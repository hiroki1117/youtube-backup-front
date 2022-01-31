import React from 'react';
import axios from 'axios';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
// import Button from '@mui/material/Button';
import { Container, InputGroup, FormControl, ListGroup, Button, DropdownButton, Dropdown} from 'react-bootstrap';

const youtubebackupApiServer = process.env.REACT_APP_API_URL

class Main extends React.Component {
    state = {
        videos: [],
        searchValue: "",
        apiMode: "video-info",
        apiModeText: "検索",
        inputValue: ""
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

    handleInputChange = (event: any) => {
        this.setState({inputValue: event.target.value})
    }

    handleAPIRequest = async (event: any) => {
        const path = this.state.apiMode

        const params = path != "videobackup-submit" ? {video_id: this.state.inputValue} : {url: this.state.inputValue}

        const res = await axios.get(youtubebackupApiServer + "/" + path ,{
            params: params
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
                <Container>
                    <InputGroup className="mb-2 mt-3">
                        <DropdownButton variant="outline-secondary" title={this.state.apiModeText}>
                            <Dropdown.Item onClick={()=>this.setState({apiMode: "video-info", apiModeText: "検索"})}>
                                検索
                            </Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.setState({apiMode: "videobackup-submit", apiModeText: "保存"})}>
                                保存
                            </Dropdown.Item>
                            <Dropdown.Item onClick={()=>this.setState({apiMode: "video-delete", apiModeText: "削除"})}>
                                削除
                            </Dropdown.Item>
                        </DropdownButton>
                        <FormControl
                          placeholder="Recipient's username"
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                          value={this.state.inputValue}
                          onChange={this.handleInputChange}
                        />
                        <Button id="button-addon2"
                            onClick={this.handleAPIRequest}
                        >
                          リクエスト
                        </Button>
                    </InputGroup>
                    <ListGroup>
                        { this.state.videos.map((value) => 
                            <ListGroup.Item action className='m-1'>
                                <div>
                                    {value["backupdate"]} : 
                                    <span onClick={()=> window.open(value["video_url"])}><YouTubeIcon /></span>
                                    <span onClick={()=> {this.presignedS3(value["video_id"]).then(x => window.open(x.data.presigned_s3url, '_blank'))}}><CloudDownloadIcon /></span>
                                    <div>{value["title"]}</div>
                                </div>
                            </ListGroup.Item>    
                        )}
                    </ ListGroup>
                    {this.state.videos.length > 0 &&
                        <Button variant="light" color='info' onClick={()=> this.getVideoList("complete", this.state.videos.length+50)}>more</Button>
                    }
                </Container>
            </div>
        )
    }
}

export default Main;
