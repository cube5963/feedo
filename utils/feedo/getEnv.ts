export async function getEnvVars(type:string):Promise<string> {
    const res = await fetch(`/api/env?type=${type}`);
    const result = await res.json();
    return result.data;
}