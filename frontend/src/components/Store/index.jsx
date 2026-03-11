import { configureStore, createSlice, combineReducers } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {          //Defining initial state of the cart
    products: [],
    quantity: 0,
    total: 0,
    withCommision:0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.quantity += 1;
      state.products.push(action.payload);//adding Product 
      state.total += action.payload.price * action.payload.quantity;
      state.withCommision = state.total + state.total* 0.05;
    },
    resetCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  cart: cartSlice.reducer,
});


export const {addProduct} = cartSlice.actions;

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: rootReducer,
  });

store.subscribe(()=>{
  const {isLoggedIn} = store.getState().auth;
  if(!isLoggedIn){
    store.dispatch(cartSlice.actions.resetCart())
  }
})