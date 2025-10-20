export async function getCookie(name: string): Promise<string | undefined> {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop();
        if (cookieValue) {
            return cookieValue.split(';').shift();
        }
    }
    return undefined;
}