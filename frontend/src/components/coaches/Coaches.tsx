import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { Box, Typography } from "@mui/material";

import { Coach } from "../../types";
import { API_URL } from "../../constants";
import { StyledButton } from "../shared/sharedStyles";

type CoachesProps = {
}

const Coaches: React.FC<CoachesProps> = ({ }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(API_URL + '/coaches/').then(res => setCoaches(res.data)).catch(err => console.log(err));
    }, []);

    return (
        <Box textAlign='center' padding='10px'>
            <Typography variant="h4">Choose a coach to test as:</Typography>
            {coaches.map((coach) =>
            (
                <StyledButton
                    key={coach.pk}
                    onClick={() => navigate('/coaches/' + coach.pk)}
                >
                    {coach.name}
                </StyledButton>
            ))}
        </Box>
    );
}

export default Coaches;