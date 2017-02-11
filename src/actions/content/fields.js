export const FILTER_FIELDS_LOAD = 'FILTER_FIELDS_LOAD'
export const FILTER_FIELDS_LOAD_SUCCESS = 'FILTER_FIELDS_LOAD_SUCCESS'
export const FILTER_FIELDS_LOAD_FAIL = 'FILTER_FIELDS_LOAD_FAIL'

export function loadFilterFields(name){
  return {
    types: [FILTER_FIELDS_LOAD, FILTER_FIELDS_LOAD_SUCCESS, FILTER_FIELDS_LOAD_FAIL],
    payload: name,
    promise: new Promise((resolve, reject) => {

    })
  }
}
