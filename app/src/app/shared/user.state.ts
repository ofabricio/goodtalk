import { State, Action, StateContext, Selector } from "@ngxs/store";

import { SetUsername } from "./app.actions";

export interface UserModel {
    name: string;
}

@State<UserModel>({
    name: 'user',
    defaults: {
        name: 'Guest'
    }
})
export class UserState {

    @Action(SetUsername)
    setUsername({ patchState, getState }: StateContext<UserModel>, { name }: SetUsername) {
        const maxLength = 25;
        name = name.trim() || getState().name;
        name = stripExtraSpaces(name).substr(0, maxLength);
        patchState({ name });
    }

    @Selector()
    static getUsername(state: UserModel) {
        return state.name;
    }
}


function stripExtraSpaces(str: string) {
    return (str.match(/(\S+)+/g) || []).join(' ');
}
