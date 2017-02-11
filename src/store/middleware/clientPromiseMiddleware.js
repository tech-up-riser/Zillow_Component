export default function clientPromiseMiddleware() {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }

      const { promise, types: [REQUEST, SUCCESS, FAILURE] = [], ...rest } = action
      if (!promise) {
        return next(action)
      }

      next({ ...rest, type: REQUEST })

      return promise(dispatch, getState).then(
        (payload) => next({ ...rest, payload, type: SUCCESS }),
        (payload) => next({ ...rest, payload, type: FAILURE })
      ).catch((payload) => {
        console.error('MIDDLEWARE ERROR:', payload)
        next({ ...rest, payload, type: FAILURE })
      })
    }
  }
}
