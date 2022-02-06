import React from 'react';
import axios from 'axios';
import { Container, InputGroup, FormControl, Button, DropdownButton, Dropdown, Tab, Tabs, Alert} from 'react-bootstrap';
import VideoList from './VideoList';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

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
        tabKey: "complete",
        apiResultJson: {result: null, video_data: {video_id: "", video_url: ""}}
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
        })
    }

    handleSelect = (key: any) => {
        if (key === "init") {
            this.getVideoList("init", 100)
        }
        this.setState({tabKey: key})
    }

    handleIconClick = (url: string) => {
        window.open(url)
    }

    handleDownloadClick = (video_id: string) => {
        this.presignedS3(video_id)
            .then(x => window.open(x.data.presigned_s3url, '_blank'))
    }

    componentDidMount(){
        this.getVideoList("complete", 50)
        this.getVideoList("init", 50)
    }

    render() {
        return (
            <Authenticator variation="modal">
            {({ signOut, user }) => (
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
                                {(this.state.apiMode==="video-info") && (this.state.apiResultJson["result"]==="succ") &&
                                    <>
                                    <Button className="ml-4 mr-4" variant="outline-success"
                                        onClick={() => window.open(this.state.apiResultJson["video_data"]["video_url"])}
                                        >
                                        GoPage
                                    </Button>
                                    <Button className="ml-4 mr-4" variant="outline-success"
                                        onClick={() => this.handleDownloadClick(this.state.apiResultJson["video_data"]["video_id"])}
                                        >
                                        Download
                                    </Button>
                                    </>
                                }
                                <Button onClick={() => this.setState({showAlert: false})} variant="outline-success">
                                    close
                                </Button>
                            </div>
                    </Alert>
                    <Tabs activeKey={this.state.tabKey} onSelect={this.handleSelect}>
                        <Tab eventKey="complete" title="complete">
                            <VideoList
                                videos={this.state.completeVideos}
                                handleIconClick={this.handleIconClick}
                                handleDownloadClick={this.handleDownloadClick}
                                />
                            {this.state.completeVideos.length > 0 &&
                                <Button variant="light" color='info' onClick={()=> this.getVideoList("complete", this.state.completeVideos.length+50)}>more</Button>
                            }
                        </Tab>
                        <Tab eventKey="init" title={"progress" + (this.state.initVideos.length === 0 ? "" : "(" + this.state.initVideos.length + ")") }>
                            <VideoList
                                videos={this.state.initVideos}
                                handleIconClick={this.handleIconClick}
                                handleDownloadClick={this.handleDownloadClick}
                                />
                        </Tab>
                    </Tabs>
                    {this.state.completeVideos.length > 0 &&
                    <div className="d-flex justify-content-end">
                        <Button onClick={signOut} color='secondary'>Sign out</Button>
                    </div>
                    }
                </Container>
            )}
            </Authenticator>
        )
    }
}

export default Main;