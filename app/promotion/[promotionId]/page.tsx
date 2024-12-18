import EditPromotion from '@/components/EditPromotion';
import { RoleAvailable } from '@/types/data_type';
import { redirectingByRole } from '@/utils/function';
import { getCurrentSession } from '@/utils/getCurrentSession';
import { PrismaClient } from '@prisma/client';

interface IParams {
  promotionId?: string;
}

export const revalidate = 0
export default async function PromotionPage({ params }: { params: IParams }) {
  const prisma = new PrismaClient();

  const session = await getCurrentSession();

  if (!session || session?.user.role != RoleAvailable.Organizer) {
      redirectingByRole(session)
      return
  }
  
  const eventDetails = await prisma.event.findUnique({
    include: {
      event_type: true,
      Seat_Type: {
        include: {
          Promotion: true,
        }
      }
    },
    where: {
      event_id: parseInt(params.promotionId || '0'), // Ensure event_id is a number
    },
  });

  // Fetch promotion types
  const promotionTypes = await prisma.promotion_Type.findMany({
    select: {
      pt_id: true,
      pt_name: true, // Assuming you have pt_name as the type's name
    },
  });

  // Map the event details to match the Event interface in your EditPromotion component
  const eventData = eventDetails ? {
    event_id: eventDetails.event_id,
    event_name: eventDetails.event_name,
    seat_types: eventDetails.Seat_Type, // Rename Seat_Type to seat_types
  } : null;

  if (!eventData) {
    return (
      <div>
        <h1>Event Not Found</h1>
        <p>The event with ID {params.promotionId} does not exist.</p>
      </div>
    );
  }

  // Map promotionTypes for easier usage
  const promotionTypeOptions = promotionTypes.map((type) => ({
    id: type.pt_id,
    name: type.pt_name,
  }));
  
  return (
    <div>
      <EditPromotion events={[eventData]} promotionTypes={promotionTypeOptions} />
    </div>
  );
}
