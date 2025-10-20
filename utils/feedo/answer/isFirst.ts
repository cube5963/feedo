import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {getCookie} from "@/utils/feedo/cookie/get";

export async function isFirstAnswer(formId: string): Promise<boolean> {
    try {
        if (typeof window === 'undefined') return true;

        const fpPromise = FingerprintJS.load();
        const fp = await fpPromise;
        const result = await fp.get();
        const visitorId = result.visitorId;

        const base = window.location.origin;
        const url = `${base}/api/fingerprint?form_id=${encodeURIComponent(formId)}&fingerprint=${encodeURIComponent(visitorId)}`;

        const res = await fetch(url);
        if (!res.ok) {
            console.error('isFirstAnswer: fetch failed', res.status, res.statusText);
            return true;
        }

        const data = await res.json();
        if (data?.error) {
            console.error('isFirstAnswer: api error', data.error);
            return true;
        }

        return data?.result !== true;
    } catch (err) {
        console.error('isFirstAnswer: unexpected error', err);
        return true;
    }
}