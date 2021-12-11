import { createStore } from './redux.js';
const COUNTER = 'count';
const FETCH = 'fetch';

const middleware1 = (store) => (dispatch) => (action) => {
  // 두 번째 함수가 호출되는 시점을 바깥쪽에서 제어할 수 있게 된다.
  if (action.type === FETCH) {
    console.log('fetch log');
    setTimeout(() => {
      dispatch({
        type: 'fetch-response',
        payload: [1, 2, 3],
      });
    }, 2000);
  } else {
    dispatch(action);
  }
  console.log('mid 1');
};

const middleware2 = (store) => (dispatch) => (action) => {
  console.log('mid 2');
  dispatch(action);
};

// 이것을 쿼링이라 한다.
// const fn = middleware1(dispatch);
// fn(action);

function reducer(state, action) {
  if (action.type === COUNTER) {
    return { ...state, counter: action.payload.counter };
  }
  if (action.type === 'fetch-response') {
    return { ...state, response: action.payload };
  }
  return state;
}

function listener() {
  console.log(store.getState());
}

function actionCreator(type, payload) {
  return {
    type,
    payload,
  };
}

const store = createStore(reducer, [middleware1, middleware2]);
// 이런 식으로 되면 dispatch가 일어나면 middleware부터 실행되고 reducer가 실행된다.
store.subscribe(listener);

store.dispatch(
  actionCreator(COUNTER, {
    counter: 1,
  })
);

store.dispatch(
  actionCreator(COUNTER, {
    counter: 2,
  })
);

function counter(data) {
  store.dispatch(actionCreator(COUNTER, data));
}
counter({ counter: 1 });

store.dispatch(actionCreator(FETCH));
