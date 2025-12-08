const ECOMAIL_API_URL = process.env.ECOMAIL_API_URL || 'https://api2.ecomailapp.cz';
const ECOMAIL_API_KEY = process.env.ECOMAIL_API_KEY;
const ECOMAIL_LIST_ID = process.env.ECOMAIL_LIST_ID;

interface EcomailSubscriberData {
  email: string;
  name?: string;
  surname?: string;
  tags?: string[];
  custom_fields?: Record<string, string>;
}

interface EcomailResponse {
  success: boolean;
  error?: string;
}

export async function addSubscriberToEcomail(
  subscriberData: EcomailSubscriberData
): Promise<EcomailResponse> {
  if (!ECOMAIL_API_KEY || !ECOMAIL_LIST_ID) {
    console.warn('Ecomail API credentials not configured');
    // Return success in development to not block the flow
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating successful Ecomail subscription');
      console.log('Subscriber data:', subscriberData);
      return { success: true };
    }
    return { success: false, error: 'Ecomail API není nakonfigurováno' };
  }

  try {
    const response = await fetch(
      `${ECOMAIL_API_URL}/lists/${ECOMAIL_LIST_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'key': ECOMAIL_API_KEY,
        },
        body: JSON.stringify({
          subscriber_data: {
            email: subscriberData.email,
            name: subscriberData.name,
            surname: subscriberData.surname,
            tags: subscriberData.tags || [],
            custom_fields: subscriberData.custom_fields,
          },
          trigger_autoresponders: true,
          update_existing: true,
          resubscribe: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Ecomail API error:', errorData);
      return {
        success: false,
        error: errorData.message || 'Chyba při komunikaci s Ecomail API'
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Ecomail API error:', error);
    return { success: false, error: 'Chyba při komunikaci s Ecomail API' };
  }
}
