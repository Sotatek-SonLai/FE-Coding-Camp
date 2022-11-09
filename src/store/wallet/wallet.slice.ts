import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {WalletInterface} from "./wallet.interface";


const initialState: WalletInterface = {
    isConnected: false,
    connectorName: null
}

export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        updateConnectedState(state, action: PayloadAction<boolean>) {
            state.isConnected = action.payload
        },
    }
})

export const {
    updateConnectedState,
} = walletSlice.actions;

export default walletSlice.reducer;
