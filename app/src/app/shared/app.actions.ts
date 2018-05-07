export class SetUsername {
    static readonly type = '[User] Set Username';
    constructor(public name: string) { }
}
export class SendMessage {
    static readonly type = '[Msgs] Send Msg';
    constructor(public msg: string) { }
}
export class ListenChatMessages {
    static readonly type = '[Msgs] Listen Chat Msgs';
}
export class TriggerChatCommand {
    static readonly type = '[Cmd] Cmd Triggered';
    constructor(public cmd: string) { }
}
export class DoNothing {
    static readonly type = '[Cmd] Do Nothing';
}
