import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';
import { ChatLogComponent } from './ui/chatlog.component';
import { ChatState } from './shared/chat.state';
import { UserState } from './shared/user.state';

@NgModule({
    declarations: [
        AppComponent,
        ChatLogComponent,
    ],
    imports: [
        BrowserModule,
        NgxsModule.forRoot([
            ChatState,
            UserState,
        ]),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
