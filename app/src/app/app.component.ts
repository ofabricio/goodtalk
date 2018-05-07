import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store, Select } from '@ngxs/store';

import { ListenChatMessages } from './shared/app.actions';
import { MsgModel } from './shared/chat.state';
import { UserModel } from './shared/user.state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @Select() chat: Observable<MsgModel[]>;

    @Select() user: Observable<UserModel>;

    constructor(private store: Store) { }

    ngOnInit(): void {
        this.store.dispatch(new ListenChatMessages);
    }

    private scrollToBottom() {
        const atBottomPage = (window.innerHeight + window.scrollY) >= document.body.scrollHeight;
        if (atBottomPage) {
            // window.scroll({ top: 9999, behavior: 'smooth' });
        }
    }
}
