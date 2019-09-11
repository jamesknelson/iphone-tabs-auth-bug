import firebase from 'firebase/app'
import 'firebase/auth'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import config from 'config'

firebase.initializeApp(config.firebase)

const auth = firebase.auth()

const App = () => {
  // Will have a value of undefined until we know whether the user
  // is logged in or not.
  let [currentUser, setCurrentUser] = useState<any>(undefined)

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setCurrentUser(user)
    })
  })

  return (
    <div>
      <p>
        Current User:{' '}
        {currentUser === undefined
          ? 'checking'
          : currentUser === null
          ? 'logged out'
          : currentUser.email}
      </p>
      <hr />
      {currentUser === null && <LoginForm />}
      {!!currentUser && <LogoutButton />}
      <hr />
    </div>
  )
}

function LoginForm() {
  let [status, setStatus] = useState('ready')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')

  return (
    <form
      onSubmit={async event => {
        event.preventDefault()
        setStatus('busy')
        try {
          await auth.signInWithEmailAndPassword(email, password)
          setStatus('done')
        } catch (error) {
          setStatus('error')
        }
      }}>
      <p>
        <label>
          Email
          <br />
          <input
            value={email}
            onChange={event => {
              setEmail(event.target.value)
            }}
          />
        </label>
      </p>
      <p>
        <label>
          Password
          <br />
          <input
            type="password"
            value={password}
            onChange={event => {
              setPassword(event.target.value)
            }}
          />
        </label>
      </p>

      <button>Login - {status}</button>
    </form>
  )
}

function LogoutButton() {
  let [status, setStatus] = useState('ready')

  return (
    <button
      onClick={async () => {
        setStatus('busy')
        try {
          await auth.signOut()
          setStatus('done')
        } catch (error) {
          setStatus('error')
        }
      }}>
      Logout - {status}
    </button>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
