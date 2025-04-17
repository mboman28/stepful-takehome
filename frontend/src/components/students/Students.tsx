import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import { API_URL } from "../../constants";
import { Student } from "../../types";
import { StyledButton } from "../shared/sharedStyles";

type StudentsProps = {
}

const Students: React.FC<StudentsProps> = ({ }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + '/students/').then(res => setStudents(res.data)).catch(err => console.log(err));
    }, []);

    return (
        <Box textAlign='center' padding='10px'>
            <Typography variant="h4">Choose a student to test as:</Typography>
            {students.map((student) => (
                <StyledButton
                    key={student.pk}
                    onClick={() => navigate('/students/' + student.pk)}
                >
                    {student.name}
                </StyledButton>
            ))}
        </Box>
    );
}

export default Students;