import React from 'react';
import axios from 'axios';
import { Routes, Route, Link } from "react-router-dom";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Container, Button} from 'react-bootstrap';
import VideoListPage from './VideoListPage';
import VideoEditorPage from './VideoEditorPage';

class Main extends React.Component {

    render() {
        return (
            <Authenticator variation="modal">
            {({ signOut, user }) => (
                <Container>
                    <Routes>
                        <Route path="/" element={<VideoListPage />} />
                        <Route path="/:videoid" element={<VideoEditorPage />} />
                    </Routes>
                    <div className="d-flex justify-content-end">
                        <Button onClick={signOut} color='secondary'>Sign out</Button>
                    </div>
                </Container>
            )}
            </Authenticator>
        )
    }
}

export default Main;