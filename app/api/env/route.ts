import {NextRequest} from "next/server";


export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get('type');

    if (!type) {
        return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
    }

    let data;
    if(type === 'URL'){
        data = process.env.SUPABASE_URL;
    }
    else if(type === 'ANON_KEY'){
        data = process.env.SUPABASE_ANON_KEY;
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

    return new Response(JSON.stringify({ data:data }), { status: 200 });
}