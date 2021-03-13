import { Observable, Subject, BehaviorSubject, defer, concat, of } from "rxjs";
import { debounceTime, filter, map, scan, skip, tap } from "rxjs/operators";

const chatlogSubject = new Subject<Msg>();

export const chatlog$: Observable<Msg[]> = concat(
    of([]),
    chatlogSubject.pipe(scan((acc, msg) => [...acc, msg].slice(-16), []))
);

const inputMsgSubject = new Subject<string>();

inputMsgSubject.pipe(
    filter(txt => txt.length > 0),
    debounceTime(200),
    tap(txt => fetch("/msg/", { method: 'POST', body: txt })),
    // map(txt => <Msg>{ who: "Me", txt, date: new Date() }),
).subscribe();

const sse = new Observable(subscriber => {
    const es = new EventSource("/msgs/");
    es.onmessage = (event) => {
        // if (event.origin != window.location.href) {
        //     console.log(`Origin was not ${window.location.href}`);
        //     return;
        // }
        subscriber.next(JSON.parse(event.data));
    };
    es.onerror = () => {
        console.log('SSE error');
    };
    return () => {
        es.close();
    };
});
sse.subscribe(chatlogSubject);

export function sendMsg(txt: string) {
    inputMsgSubject.next(txt.trim());
}

interface Msg {
    who: string;
    txt: string;
    date: Date;
}

interface User {
    token: string;
    who: string;
}
