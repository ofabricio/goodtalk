import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";

import { MsgModel } from "../shared/chat.state";
import { UserModel } from "../shared/user.state";

@Injectable({ providedIn: 'root' })
export class RealtimeService {

    placeholder: MsgModel[] = [
        { name: "Me", msg: "Hello!", time: new Date() },
        { name: "You", msg: "Hi.", time: new Date() },
    ]

    constructor() { }

    listenMessages(): Observable<MsgModel[]> {
        return of(this.placeholder)
    }

    postMessage(msg: string, user: UserModel): Observable<MsgModel[]> {
        const payload = { ...user, msg, time: new Date() };
        this.placeholder.push(payload)
        return of(this.placeholder);
    }
}
