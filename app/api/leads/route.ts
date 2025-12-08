import { NextRequest, NextResponse } from 'next/server';
import { addSubscriberToEcomail } from '@/lib/ecomail';

interface LeadRequestBody {
  email: string;
  marketingConsent: boolean;
  recommendedProductId: string;
  alternativeProductIds: string[];
  formAnswers: Record<string, string>;
  tags: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadRequestBody = await request.json();

    const { email, tags } = body;

    // Email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Neplatná e-mailová adresa' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Neplatný formát e-mailové adresy' },
        { status: 400 }
      );
    }

    // Add to Ecomail
    const result = await addSubscriberToEcomail({
      email,
      tags,
    });

    if (!result.success) {
      console.error('Ecomail error:', result.error);
      return NextResponse.json(
        { success: false, error: result.error || 'Chyba při ukládání e-mailu' },
        { status: 500 }
      );
    }

    // Log for analytics (in production, you might want to store this in a database)
    console.log('Lead captured:', {
      email: email.replace(/(.{2}).*@/, '$1***@'), // Partially mask email for logs
      recommendedProductId: body.recommendedProductId,
      marketingConsent: body.marketingConsent,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'E-mail byl úspěšně uložen.',
    });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { success: false, error: 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}
