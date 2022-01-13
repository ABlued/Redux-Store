import { createStore } from './redux.js';
const COUNTER = 'count';
const FETCH = 'fetch';

/**
 * reducer는 기본적으로 동기적인 처리를 할 수 밖에 없다.
 * 그러면 비동기의 처리는 미들웨어를 통해 처리를 한다.
 * 미들웨어는 스토어의 dispatch와 getstate를 쓰기 위해
 * 첫번째 매개변수는 store를 갖는다.
 * 또한 어떤 컴포넌트에서 dispatch를 하고 api를 호출해야 하니
 * 두번째 매개변수는 dispatch를 갖는다.
 * api를 호출한 후 받은 response를 통해 액션을 취해야하니
 * 세번째 매개변수는 action을 갖는다.
 * 하지만 이게 바로 하나의 함수의 매개변수로 보내는 것이 아닌
 * 세 번의 타이밍
 * 1. 스토어에 미들웨어가 필요하다.
 * 2. 이 dispatch에 비동기 처리가 필요하다.
 * 3. 비동기 처리 이후 응답결과를 상태값을 수정한다.
 * 을 통해 호출해야하니 쿼링을 통해 구현하는 것이다.
 */

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

// action은 스토어의 어떤 상태를 바꿔주는지 알려주는 하나의 폼이다.
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
