import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const About = () => {
    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    About the Journal Management System
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to the Author Portal of our Journal Management System. As an author, this platform provides you with a streamlined experience 
                    to submit, track, and manage your scholarly contributions with ease and transparency.
                </Typography>
                <Typography variant="body1" paragraph>
                    The system is designed to support you throughout your publishing journey — from initial manuscript submission to final decision. 
                    You can communicate with editors, respond to reviewer feedback, and monitor the progress of your submission in real-time.
                </Typography>
                <Typography variant="body1" paragraph>
                    Our goal is to reduce administrative overhead, ensure clarity in communication, and empower you with all the tools you need for a smooth and successful publishing experience.
                </Typography>
                <Typography variant="body1" paragraph>
                    Key features available to you as an author:
                </Typography>
                <ul>
                    <li>Submit new manuscripts with structured, guided forms</li>
                    <li>Track the real-time status of your submissions</li>
                    <li>Communicate efficiently with editorial teams</li>
                    <li>View and respond to reviewer feedback</li>
                    <li>Upload revised manuscripts with version control</li>
                    <li>Update your author profile and research interests</li>
                    <li>Get notified of important updates and editorial decisions</li>
                    <li>Ensure compliance with submission guidelines through built-in validations</li>
                </ul>
                <Typography variant="body1" paragraph>
                    We are committed to providing a professional, author-centric experience to help you focus on what matters most — your research and its impact.
                </Typography>
            </Box>
        </Container>
    )
}

export default About;
