import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import { Box } from "@mui/material";

import { API_URL } from "../../constants";
import { Student } from "../../types";
import { StyledButton } from "../shared/sharedStyles";

type StudentViewProps = {
}

const StudentView: React.FC<StudentViewProps> = ({ }) => {
    const [student, setStudent] = useState<Student | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + '/students/' + id).then(res => setStudent(res.data)).catch(err => console.log(err));
    }, [])

    return (
        <Box textAlign='center' padding='10px'>
            <h3>Student name: {student?.name} </h3>
            <h3>ID #: {student?.pk}</h3>
            <StyledButton onClick={() => navigate('/students/' + id + '/book')}>Book a Session</StyledButton>
            <StyledButton onClick={() => navigate('/students/' + id + '/upcoming')}>My Upcoming Sessions</StyledButton>
        </Box>
    );
}

export default StudentView;