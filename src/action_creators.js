function setState( state ){
  return {
    type: 'SET_STATE',
    state
  };
}

function vote( entry ){
  return {
    meta: {remote: true},
    type: 'VOTE',
    entry
  };
}

function next(){
  return {
    meta: {remote: true},
    type: 'NEXT'
  };
}

export { setState, vote, next }
