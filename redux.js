export function createStore(reducer, middleware = []) {
  let state;
  const handler = [];

  // 스토어의 상태를 바꿔주는 함수
  function dispatch(action) {
    middleware(dispatch, action);
    state = reducer(state, action);
    handler.forEach((listener) => {
      listener();
    });
  }

  function getState() {
    return state;
  }

  function subscribe(listener) {
    handler.push(listener);
  }

  const store = {
    getState,
    subscribe,
  };
  middleware = Array.from(middleware).reverse();

  let lastDispatch = dispatch;

  middleware.forEach((middlewareModule) => {
    lastDispatch = middlewareModule(store)(lastDispatch);
  });

  return {
    store,
    dispatch: lastDispatch,
  };
}
