import { PrismaClient } from '@prisma/client';
import Eventpage from "@/components/Eventpage";

export default async function EventLanding({ params }: { params: { eventId: string }}) {
    const prisma = new PrismaClient();
    const details = await prisma.event.findFirst( {
        include: {
            event_type: true,
            Seat_Type: {
                Seat_Dispatch: true
            }
        },
        where:  {
            event_id: parseInt(params.eventId),
        }
    })
    console.log(details)
    if (details)
    return(
        <div>
            <Eventpage eventDetails={details}/>
        </div>
    )
    else {
        return (
            <>wow</>
        )
    }
}