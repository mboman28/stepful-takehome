import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "./sharedStyles";

type HomeProps = {

}

const Home: React.FC<HomeProps> = () => {
    const navigate = useNavigate();
    return (
        <>
            <Typography variant="h4">Choose a user type to test</Typography>
            <Box textAlign='center' padding='10px'>
                <StyledButton onClick={() => navigate('/coaches')}>Coaches</StyledButton>
                <StyledButton onClick={() => navigate('/students')}>Students</StyledButton>
            </Box>
        </>
    )
}

export default Home;