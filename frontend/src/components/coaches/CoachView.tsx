import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import { Box } from "@mui/material";

import { Coach } from "../../types";
import { API_URL } from "../../constants";
import { StyledButton } from "../shared/sharedStyles";

type CoachViewProps = {
}

const CoachView: React.FC<CoachViewProps> = ({ }) => {
    const [coach, setCoach] = useState<Coach | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + '/coaches/' + id).then(res => setCoach(res.data)).catch(err => console.log(err));
    }, [])

    return (
        <Box textAlign='center' padding='10px'>
            <h3>Coach name: {coach?.name} </h3>
            <h3>ID #: {coach?.pk}</h3>
            <StyledButton onClick={() => navigate('/coaches/' + id + '/availability')}>My Availability</StyledButton>
            <StyledButton onClick={() => navigate('/coaches/' + id + '/pastsessions')}>My Past Sessions</StyledButton>
        </Box>
    );
}

export default CoachView;