import React ,{useState, useEffect}  from 'react';
import { Routes, Route, Link, useParams} from "react-router-dom";
import axios from 'axios';
import { Container, Button} from 'react-bootstrap';

const youtubebackupApiServer = process.env.REACT_APP_API_URL

function VideoEditorPage() {
    let params = useParams();
    let [s3url, setS3Url] = useState("")

    useEffect(()=> {
        presignedS3(params.videoid as string)
        .then(result => {
            setS3Url(_ => result.data.presigned_s3url)
        })
    }, [])

    return (
        <Container>
            {s3url !== "" &&
                <video controls src={s3url}></video>
            }
            <hr />
            <h1>Here Some Controls Form</h1>
            <h3>trim</h3>
            <h3>concat</h3>
            <h3>multicut</h3>
            <h3>summarize</h3>
            <h3>subtitles</h3>
            <Button>Start Transform And Upload Youtube</Button>
            <Link to="/"><Button variant="light">Home</Button></Link>
        </ Container>
    )
}

const presignedS3 = async (videoId: String) => {
    const path = "presigned-s3url"
    const res = await axios.get(youtubebackupApiServer + "/" + path ,{
        params: {
            video_id: videoId
        }
    })
    return res
}

export default VideoEditorPage;