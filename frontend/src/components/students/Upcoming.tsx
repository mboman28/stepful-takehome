import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";

import { API_URL } from "../../constants";
import { TimeSlot } from "../../types";
import { StyledButton } from "../shared/sharedStyles";
import { Box, Typography } from "@mui/material";

type UpcomingProps = {
}

const Upcoming: React.FC<UpcomingProps> = ({ }) => {
    const { id } = useParams();
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selected, setSelected] = useState<number | undefined>(undefined);
    const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);

    useEffect(() => {
        axios.get(API_URL + '/timeslots/?registered=' + id + '&future=true').then((res) => {
            let slots = res.data.toSorted((a: TimeSlot, b: TimeSlot) => {
                if (new Date(b.startTime) > new Date(a.startTime)) return -1;
                if (new Date(a.startTime) > new Date(b.startTime)) return 1;
                return 0;
            })
            setTimeSlots(slots);
        }).catch(err => console.log(err));
        if (selected !== undefined) {
            axios.get(API_URL + '/timeslots/' + selected).then(res => setTimeSlot(res.data)).catch(err => console.log(err));
        }
    }, [selected]);

    function cancelSession() {
        axios.put(API_URL + '/timeslots/' + selected, { 'registered': null, 'owner': timeSlot?.owner.pk, 'startTime': timeSlot?.startTime }).then(() => {
            setSelected(undefined);
            setTimeSlot(null);
        }).catch(err => console.log(err));
    }

    return (
        <Box textAlign='center' padding='10px'>
            <Typography variant="h4">Your upcoming timeslots</Typography>
            {timeSlots.map((ts) => (<StyledButton onClick={() => {
                if (selected == ts.pk) {
                    setSelected(undefined);
                    setTimeSlot(null);
                }
                else {
                    setSelected(ts.pk)
                }
            }}>{new Date(ts.startTime).toLocaleString('default')}</StyledButton>))}
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
        </Box>
    );
}

export default Upcoming;