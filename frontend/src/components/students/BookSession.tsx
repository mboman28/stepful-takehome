import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import { API_URL } from "../../constants";
import { TimeSlot } from "../../types";
import { StyledButton } from "../shared/sharedStyles";
import { timesOverlap } from "../../utils";

type BookSessionProps = {
}

const BookSession: React.FC<BookSessionProps> = ({ }) => {
    const { id } = useParams();
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        let avaSlots: TimeSlot[] = [];
        axios.get(API_URL + '/timeslots/?registered=' + id + '&future=true').then(
            (registered) => {
                axios.get(API_URL + '/timeslots/?free=true&future=true').then(
                    free => {
                        
                        for (let freeSlot of free.data) {
                            let overlap = false;
                            let avaStart = new Date(freeSlot.startTime)
                            let avaEnd = new Date(avaStart.getFullYear(), avaStart.getMonth(), avaStart.getDate(), avaStart.getHours() + 2, avaStart.getMinutes(), avaStart.getSeconds(), avaStart.getMilliseconds())
                            for (let slot of registered.data) {
                                let start = new Date(slot.startTime)
                                let end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours() + 2, start.getMinutes(), start.getSeconds(), start.getMilliseconds())
                                if (timesOverlap(start, end, avaStart, avaEnd)) {
                                    overlap = true;
                                    break;
                                }
                            }
                            if (!overlap) {
                                avaSlots.push(freeSlot);
                            }
                        }
                        let slots = (avaSlots as any).toSorted((a: TimeSlot, b:TimeSlot) => {
                            if (new Date(b.startTime) > new Date(a.startTime)) return -1;
                            if (new Date(a.startTime) > new Date(b.startTime)) return 1;
                            return 0;
                          })
                        setTimeSlots(slots);
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));

    }, []);

    function bookSlot(slotId: number, owner: number, startTime: string) {
        axios.put(API_URL + '/timeslots/' + slotId, { 'registered': id, 'owner': owner, 'startTime': startTime }).then(() => navigate('/students/' + id + '/upcoming')).catch(err => console.log(err));
    }

    return (
        <Box>
            <Typography variant="h4">Available timeslots</Typography>
            {timeSlots.map((ts) => (
                <Box display='flex'>
                    <Box>
                        <div>Coach: {ts.owner.name}</div>
                        {(new Date(ts.startTime)).toLocaleString("default")}
                        </Box>
                    <StyledButton onClick={() => bookSlot(ts.pk, ts.owner.pk, ts.startTime)}>Book Time</StyledButton>
                </Box>
            ))}
        </Box>
    );
}

export default BookSession;