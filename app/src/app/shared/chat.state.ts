import { tap } from "rxjs/operators";

import { State, Action, StateContext, Store } from "@ngxs/store";

import { RealtimeService } from "../services/realtime.service";
import { SetUsername, SendMessage, ListenChatMessages, TriggerChatCommand, DoNothing } from "./app.actions";
import { UserModel } from "./user.state";

export interface MsgModel {
    name: string;
    msg: string;
    time: Date;
}

@State<MsgModel[]>({
    name: 'chat',
    defaults: []
})
export class ChatState {

    constructor(private store: Store, private service: RealtimeService) { }

    @Action(ListenChatMessages)
    listenMessages(ctx: StateContext<MsgModel[]>) {
        return this.service.listenMessages().pipe(tap(items => ctx.setState(items)));
    }

    @Action(SendMessage)
    sendMessage({ dispatch }: StateContext<MsgModel[]>, { msg }: SendMessage) {
        msg = msg.trim();
        if (!msg) {
            return dispatch(new DoNothing);
        }
        if (msg.startsWith('/')) {
            return dispatch(new TriggerChatCommand(msg));
        }
        const user = this.store.selectSnapshot<UserModel>(s => s.user);
        return this.service.postMessage(msg, user);
    }

    @Action(TriggerChatCommand)
    newChatCommand({ dispatch }: StateContext<MsgModel[]>, { cmd }: TriggerChatCommand) {
        const [, command, args] = cmd.match(/\/(\S+)(.*)/);
        const Action = cmds[command] || DoNothing;
        return dispatch(new Action(args));
    }
}

const cmds = {
    name: SetUsername,
};
