import React from 'react';
import axios from 'axios';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Container, InputGroup, FormControl, ListGroup, Button, DropdownButton, Dropdown, Tab, Tabs, Alert} from 'react-bootstrap';
import PlatformIcon from './PlatformIcon';

const youtubebackupApiServer = process.env.REACT_APP_API_URL

class Main extends React.Component {
    state = {
        completeVideos: [],
        initVideos: [],
        searchValue: "",
        apiMode: "video-info",
        apiModeText: "検索",
        inputValue: "",
        showAlert: false,
        apiResultJson: {}
    }

    getVideoList = async (uploadStatus: String, fetchNum: Number) => {
        const path = "video-list"
        const res = await axios.get(youtubebackupApiServer + "/" + path ,{
            params: {
                upload_status: uploadStatus,
                fetch_num: fetchNum
            }
        })
        if (uploadStatus === "complete") {
            this.setState({completeVideos: res.data})
        } else if(uploadStatus === "init") {
            this.setState({initVideos: res.data})
        }
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

        const params = path !== "videobackup-submit" ? {video_id: this.state.inputValue} : {url: this.state.inputValue}

        await axios.get(youtubebackupApiServer + "/" + path ,{
            params: params
        }).then(result => {
            this.setState({showAlert: true})
            this.setState({apiResultJson: result.data})
            // alert(JSON.stringify(result.data))
        })
    }

    handleSelect = (key: any) => {
        if (key === "init") {
            this.getVideoList("init", 100)
        }
    }

    componentDidMount(){
        this.getVideoList("complete", 50)
        this.getVideoList("init", 50)
    }

    render() {
        console.log(this.state.completeVideos)
        
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
                          placeholder={this.state.apiMode !== "videobackup-submit" ? "video_id" : "url"}
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                          value={this.state.inputValue}
                          onChange={this.handleInputChange}
                        />
                        <Button onClick={this.handleAPIRequest}>
                          リクエスト
                        </Button>
                    </InputGroup>
                    <Alert show={this.state.showAlert} variant="success">
                        <Alert.Heading>リクエスト結果</Alert.Heading>
                            <p>
                                {JSON.stringify(this.state.apiResultJson, null, 4)}
                            </p>
                            <hr />
                            <div className="d-flex justify-content-end">
                              <Button onClick={() => this.setState({showAlert: false})} variant="outline-success">
                                close
                              </Button>
                            </div>
                    </Alert>
                    <Tabs defaultActiveKey="complete" onSelect={this.handleSelect}>
                        <Tab eventKey="complete" title="complete">
                            <ListGroup>
                                { this.state.completeVideos.map((value) => 
                                    <ListGroup.Item key={value["video_id"]} action className='m-1'>
                                        <div>
                                            {value["backupdate"]} : 
                                            <span onClick={()=> window.open(value["video_url"])}>{PlatformIcon(value["platform"])}</span>
                                            <span onClick={()=> {this.presignedS3(value["video_id"]).then(x => window.open(x.data.presigned_s3url, '_blank'))}}><CloudDownloadIcon /></span>
                                            <div>{value["title"]}</div>
                                        </div>
                                    </ListGroup.Item>    
                                )}
                            </ ListGroup>
                            {this.state.completeVideos.length > 0 &&
                                <Button variant="light" color='info' onClick={()=> this.getVideoList("complete", this.state.completeVideos.length+50)}>more</Button>
                            }
                        </Tab>
                        <Tab eventKey="init" title={"progress" + (this.state.initVideos.length === 0 ? "" : "(" + this.state.initVideos.length + ")") }>
                            <ListGroup>
                                { this.state.initVideos.map((value) => 
                                    <ListGroup.Item key={value["video_id"]} action className='m-1'>
                                        <div>
                                            {value["backupdate"]} : 
                                            <span onClick={()=> window.open(value["video_url"])}>{PlatformIcon(value["platform"])}</span>
                                            <div>{value["title"]}</div>
                                        </div>
                                    </ListGroup.Item>    
                                )}
                            </ ListGroup>
                        </Tab>
                    </Tabs>
                </Container>
            </div>
        )
    }
}

export default Main;
