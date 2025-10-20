import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {getCookie} from "@/utils/feedo/cookie/get";

export async function isFirstAnswer(formId:string):Promise<boolean>{
    const fpPromise = FingerprintJS.load();
    await (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const visitorId = result.visitorId;

        const res = await fetch(`/api/fingerprint?form_id=${formId}&fingerprint=${visitorId}`);
        const data = await res.json();
        if (data.error) throw data.error;

        if (data.result === true) {
            const answerUserFromCookie = await getCookie('answer_user');
            const answerUserFromLocalStorage = localStorage.getItem('answer_user');

            return !(answerUserFromCookie || answerUserFromLocalStorage);

        }
    })();
}