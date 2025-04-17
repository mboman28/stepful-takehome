import { Box, Button, styled, Typography } from "@mui/material";

export const Title = styled(Typography)({
  flexGrow: 1,
  color: 'white',
  cursor: 'pointer',
  textAlign: 'left',
  textDecoration: 'none',
})

export const ModalContent = styled(Box)({
  width: '90%',
  height: '90%',
  background: 'white',
  margin: 'auto',
  marginTop: '20px',
})

export const StyledButton = styled(Button)({
  textAlign: 'center',
  textTransform: 'none',
  border: '1px solid black',
  color: 'black',
  flex: '0 0 auto',
  margin: '5px',

  '&:hover': {
    backgroundColor: '#a8a1a3',
  },
})