import React from 'react'

export default function NoGames() {
  return (
    <React.Fragment>
      <div id='session-request'>
        <label>Sorry, there don't seem to be any active games at the moment. </label>
        <p>Try hosting one yourself!</p>
        <code>Or, wait until the network establishes a connection or somebody else hosts one.</code>
      </div>
    </React.Fragment>
  )
}
