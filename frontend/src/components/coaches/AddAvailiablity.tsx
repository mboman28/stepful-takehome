import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";

import { AppBar, Box, Button, Modal, Toolbar, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import axios from "axios";

import { TimeSlot } from "../../types";
import { API_URL } from "../../constants";
import { ModalContent, StyledButton, Title } from "../shared/sharedStyles";
import { timesOverlap } from "../../utils";

const availableTimes = [
    [8, 0],
    [8, 30],
    [9, 0],
    [9, 30],
    [10, 0],
    [10, 30],
    [11, 0],
    [11, 30],
    [12, 0],
    [12, 30],
    [13, 0],
    [13, 30],
    [14, 0],
    [14, 30],
    [15, 0],
    [15, 30],
    [16, 0],
    [16, 30],
    [17, 0],
]

type AddTimeSlotModalProps = {
    id: string | undefined;
    open: boolean;
    closeModal: () => void;
}

const AddTimeSlotModal: React.FC<AddTimeSlotModalProps> = ({ id, open, closeModal }) => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    const [date, setDate] = useState<Date>(tomorrow);
    const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
    const [update, forceUpdate] = useReducer(x => x + 1, 0);

    let possibleSlots = availableTimes.map((t) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), t[0], t[1], 0, 0))

    function filterExistingSlots(slots: TimeSlot[]) {
        let avaSlots: Date[] = []
        for (let avaStart of possibleSlots) {
            let overlap = false;
            let avaEnd = new Date(avaStart.getFullYear(), avaStart.getMonth(), avaStart.getDate(), avaStart.getHours() + 2, avaStart.getMinutes(), avaStart.getSeconds(), avaStart.getMilliseconds())
            for (let slot of slots) {
                let start = new Date(slot.startTime)
                let end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours() + 2, start.getMinutes(), start.getSeconds(), start.getMilliseconds())
                if (timesOverlap(start, end, avaStart, avaEnd)) {
                    overlap = true;
                    break;
                }
            }
            if (!overlap) {
                avaSlots.push(avaStart)
            }
        }
        setAvailableSlots(avaSlots);
    }

    function addTimeSlot(slot: Date) {
        axios.post(API_URL + '/timeslots/', { 'registered': null, 'owner': id, 'startTime': slot.toISOString() }).then(() => forceUpdate()).catch(err => console.log(err));
    }

    useEffect(() => {
        axios.get(API_URL + '/timeslots/?owner=' + id + '&date=' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
            .then(res => filterExistingSlots(res.data)).catch(err => console.log(err));
    }, [date, update])

    return (
        <Modal open={open} >
            <ModalContent>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Title>Add Availability</Title>
                        <Button onClick={() => {
                            setDate(new Date(tomorrow));
                            closeModal();
                        }}
                            sx={{ color: 'white' }}>
                            <CloseIcon />
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box>
                    <Box textAlign='center'>
                        <Box display='flex'>
                            <Button
                                disabled={date.getFullYear() === tomorrow.getFullYear() && date.getMonth() === tomorrow.getMonth() && date.getDate() === tomorrow.getDate()}
                                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1))}
                            >
                                <ArrowBackIcon />
                            </Button>
                            <Box alignContent='center'>date: {date.toLocaleString("default", { year: "numeric", month: "long", day: "numeric" })}</Box>
                            <Button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))}><ArrowForwardIcon /></Button>
                        </Box>
                    </Box>
                    <Box display='flex' flexWrap='wrap' margin='5px'>
                        {availableSlots.map((slot) =>
                        (<Box display='flex'>
                            <Box alignContent="center">{slot.toLocaleString("default")}</Box>
                            <StyledButton onClick={() => addTimeSlot(slot)}>Add this timeslot</StyledButton>
                        </Box>)
                        )}
                    </Box>
                </Box>
            </ModalContent>
        </Modal>
    )
}

type AddAvailabilityProps = {
}

const AddAvailability: React.FC<AddAvailabilityProps> = ({ }) => {
    const { id } = useParams();
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState<number | undefined>(undefined);
    const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);

    useEffect(() => {
        axios.get(API_URL + '/timeslots/?owner=' + id + '&future=true').then((res) => {
            let slots = res.data.toSorted((a: TimeSlot, b: TimeSlot) => {
                if (new Date(b.startTime) > new Date(a.startTime)) return -1;
                if (new Date(a.startTime) > new Date(b.startTime)) return 1;
                return 0;
            })
            setTimeSlots(slots);
        }).catch(err => console.log(err));
    }, [modalOpen, selected]);

    useEffect(() => {
        if(selected !== undefined) {
            axios.get(API_URL + '/timeslots/' + selected).then(res => setTimeSlot(res.data)).catch(err => console.log(err));
        }
    }, [selected]);

    function cancelSession() {
        axios.delete(API_URL + '/timeslots/' + selected).then(() => {
            setSelected(undefined);
        }).catch(err => console.log(err));
    }

    return (
        <>
            <AddTimeSlotModal id={id} open={modalOpen} closeModal={() => setModalOpen(false)}></AddTimeSlotModal>
            <Box textAlign='center' padding='10px'>
                <StyledButton onClick={() => setModalOpen(true)}>Add a timeslot</StyledButton>
            </Box>
            <Typography textAlign='center' variant="h4" margin='30px 0'>Your upcoming timeslots</Typography>
            <Box textAlign='center' padding='10px'>
                {timeSlots.map((ts) => (
                    <StyledButton onClick={() => {
                        if (selected === ts.pk) {
                            setSelected(undefined);
                            setTimeSlot(null);
                        }
                        else {
                            setSelected(ts.pk);
                        }
                        }}>
                        <Box>
                            <div>{(new Date(ts.startTime)).toLocaleString("default")}</div>
                            <div>{ts.registered ? "(Booked)" : "(Free)"}</div>
                        </Box>
                    </StyledButton>
                ))}
            </Box>
            {timeSlot ?
                <Box padding='10px'>
                    <div>{new Date(timeSlot.startTime).toLocaleString('default')}</div>
                    <div>Coach:</div>
                    <div>Name: {timeSlot.owner.name}</div>
                    <div>Phone: {timeSlot.owner.phone}</div>
                    {timeSlot.registered ?
                        <>
                            <div>Student:</div>
                            <div>Name: {timeSlot.registered?.name}</div>
                            <div>Phone: {timeSlot.registered?.phone}</div>
                        </>
                        :
                        <div>Not booked</div>
                    }
                    <StyledButton onClick={() => cancelSession()}>Cancel Session</StyledButton>
                </Box>
                : <></>
            }
        </>
    );
}

export default AddAvailability;