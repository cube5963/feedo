import {NextRequest} from "next/server";


export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get('type');

    if (!type) {
        return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    let data;
    if(type === 'SUPABASE_URL'){
        data = process.env.SUPABASE_URL;
    }
    else if(type === 'SUPABASE_ANON_KEY'){
        data = process.env.SUPABASE_ANON_KEY;
    }
    else if(type === 'AI_API_URL'){
        data = process.env.AI_API_URL;
    }
    else if(type === 'AI_API_KEY'){
        data = process.env.AI_API_KEY;
    }
    else if(type === 'REDIRECT_URL'){
        data = process.env.REDIRECT_URL;
    }
    else if(type === 'CF_TURNSTILE_SITE_KEY'){
        data = process.env.CF_TURNSTILE_SITE_KEY;
    }

    if(data === undefined || data === null)
        return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });

    return new Response(JSON.stringify({ data:data }), { status: 200 });
}