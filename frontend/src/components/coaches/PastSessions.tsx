import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { AppBar, Toolbar, TextField, Modal, Button, Select, MenuItem, Box, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import axios from "axios";

import { API_URL } from "../../constants";
import { Notes, TimeSlot } from "../../types";
import { ModalContent, StyledButton, Title } from "../shared/sharedStyles";

type PastTimeSlotProps = {
    editing: boolean;
    open: boolean;
    timeSlot?: TimeSlot;
    notes: Notes | undefined;
    closeModal: () => void;
    setEditing: (editing: boolean) => void;
}

const PastTimeSlot: React.FC<PastTimeSlotProps> = ({ editing, open, timeSlot, notes, closeModal, setEditing }) => {
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [showErrMsg, setShowErrMsg] = useState(false);

    function saveNotes() {
        if (notes !== undefined) {
            axios.put(API_URL + '/notes/' + notes?.pk, { 'notes': text ? text : notes.notes, 'rating': rating ? rating : notes.rating, 'timeslot': timeSlot?.pk }).then(() => setEditing(false)).catch(err => console.log(err));
        }
        else {
            if (text === "") {
                setShowErrMsg(true);
            }
            else {
                setShowErrMsg(false);
                axios.post(API_URL + '/notes/', { 'notes': text, 'rating': rating ? rating : 1, 'timeslot': timeSlot?.pk }).then(() => setEditing(false)).catch(err => console.log(err));
            }
        }
    }

    return (

        <Modal open={open}>
            <ModalContent>
                <AppBar position="sticky">
                    <Toolbar variant="dense">
                        <Title>Past Session</Title>
                        <Button onClick={() => {
                            setEditing(false);
                            closeModal();
                        }}
                            sx={{ color: 'white' }}>
                            <CloseIcon />
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box textAlign='center' padding='10px'>
                        <Typography variant="h4">Past Session</Typography>
                        <div>Coach:</div>
                        <div>Name: {timeSlot?.owner.name}</div>
                        <div>Phone: {timeSlot?.owner.phone}</div>
                        <div>Student:</div>
                        <div>Name: {timeSlot?.registered?.name}</div>
                        <div>Phone: {timeSlot?.registered?.phone}</div>
                        <Box marginTop='30px'>
                            <Typography variant="h4">Notes:</Typography>
                            {editing ?
                                <Box>
                                    <Box display='flex'>
                                        <Box alignContent='center'>
                                            Student Rating:
                                        </Box>
                                        <Select defaultValue={notes?.rating} onChange={e => setRating(Number(e.target.value))}>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                        </Select>
                                    </Box>
                                    <TextField sx={{ flexGrow: 1 }} fullWidth defaultValue={notes?.notes} onChange={e => setText(e.target.value)} />
                                    {showErrMsg ? <div>Notes may not be empty</div> : <></>}
                                    <StyledButton onClick={() => saveNotes()}>Save</StyledButton>
                                </Box>
                                :
                                <>
                                    <div>Rating: {notes?.rating}</div>
                                    <div>{notes?.notes}</div>
                                    <StyledButton onClick={() => setEditing(true)}>Edit Notes</StyledButton>
                                </>
                            }
                    </Box>
                </Box>
            </ModalContent>
        </Modal>
    );
}

type PastSessionsProps = {
}

const PastSessions: React.FC<PastSessionsProps> = ({ }) => {
    const { id } = useParams();
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selected, setSelected] = useState<number | undefined>(undefined);
    const [timeSlot, setTimeSlot] = useState<TimeSlot | undefined>(undefined);
    const [notes, setNotes] = useState<Notes | undefined>(undefined);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        axios.get(API_URL + '/timeslots/?owner=' + id + '&unregistered=true&past=true').then(res => setTimeSlots(res.data)).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (selected !== undefined) {
            axios.get(API_URL + '/timeslots/' + selected).then(res => setTimeSlot(res.data)).catch(err => console.log(err));
            axios.get(API_URL + '/notes/?timeslot=' + selected).then(res => setNotes(res.data)).catch(err => console.log(err));
        }
    }, [selected, editing])

    return (
        <>
            <Typography variant="h4">Your past sessions</Typography>
            <Box textAlign='center' padding='10px'>
                {timeSlots.map((ts) => (<StyledButton onClick={() => setSelected(ts.pk)}>{(new Date(ts.startTime)).toLocaleString("default")}</StyledButton>))}
                <PastTimeSlot
                    editing={editing}
                    open={selected !== undefined}
                    timeSlot={timeSlot}
                    notes={notes}
                    closeModal={() => setSelected(undefined)}
                    setEditing={setEditing} />
            </Box>
        </>
    );
}

export default PastSessions;