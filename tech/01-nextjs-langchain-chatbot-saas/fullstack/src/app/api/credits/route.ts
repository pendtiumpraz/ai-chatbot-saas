import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/credits - Get user's credit balance and transactions
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const type = req.nextUrl.searchParams.get('type'); // 'balance' or 'transactions'

    if (type === 'transactions') {
      // Get transactions
      const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50');
      const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

      const { data: transactions, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('workspace_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return NextResponse.json({ transactions });
    }

    // Default: Get balance
    let { data: credits, error } = await supabase
      .from('credits')
      .select('*')
      .eq('workspace_id', user.id)
      .single();

    // Create credits record if doesn't exist
    if (!credits) {
      const { data: newCredits, error: createError } = await supabase
        .from('credits')
        .insert({
          workspace_id: user.id,
          balance: 0,
          total_purchased: 0,
          total_used: 0,
        })
        .select()
        .single();

      if (createError) throw createError;
      credits = newCredits;
    }

    if (error) throw error;

    return NextResponse.json({ credits });
  } catch (error: any) {
    console.error('Credits GET error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/credits - Purchase credits (with Stripe integration)
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, paymentMethod } = body; // amount in USD

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Stripe payment
    // const paymentIntent = await stripe.paymentIntents.create({ ... })

    // For now, simulate successful payment
    // Get current credits
    let { data: credits } = await supabase
      .from('credits')
      .select('*')
      .eq('workspace_id', user.id)
      .single();

    if (!credits) {
      // Create credits record
      const { data: newCredits } = await supabase
        .from('credits')
        .insert({
          workspace_id: user.id,
          balance: 0,
          total_purchased: 0,
          total_used: 0,
        })
        .select()
        .single();
      
      credits = newCredits!;
    }

    const newBalance = (credits.balance || 0) + amount;
    const newTotalPurchased = (credits.total_purchased || 0) + amount;

    // Update credits
    const { data: updatedCredits, error: updateError } = await supabase
      .from('credits')
      .update({
        balance: newBalance,
        total_purchased: newTotalPurchased,
        updated_at: new Date().toISOString(),
      })
      .eq('workspace_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log transaction
    await supabase
      .from('credit_transactions')
      .insert({
        workspace_id: user.id,
        type: 'purchase',
        amount,
        balance_after: newBalance,
        description: `Purchased $${amount} credits`,
        metadata: { payment_method: paymentMethod || 'card' },
      });

    return NextResponse.json({
      credits: updatedCredits,
      message: 'Credits purchased successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Credits POST error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
