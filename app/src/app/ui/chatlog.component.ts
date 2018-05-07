import { Component, Input } from '@angular/core';

import { Store } from '@ngxs/store';

import { SendMessage } from '../shared/app.actions';
import { MsgModel } from '../shared/chat.state';
import { UserModel } from '../shared/user.state';

@Component({
    selector: 'chatlog',
    templateUrl: './chatlog.component.html',
    styleUrls: ['./chatlog.component.css']
})
export class ChatLogComponent {

    @Input() model: MsgModel | UserModel;
    @Input() state: string;

    constructor(private store: Store) { }

    onEnter(input) {
        this.store.dispatch(new SendMessage(input.value));
        input.value = '';
    }
}
