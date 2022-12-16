import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 60})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    // console.log(data)
    // console.log(response)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    // if (jwtToken === undefined) {
    //   return <Redirect to="/login" />
    // }

    return (
      <>
        <div className="login-form-container">
          <img
            src="https://res.cloudinary.com/dw563hktd/image/upload/v1670926616/Rectangle_1467_ujhqwj.jpg"
            alt="website login"
            className="login-image"
          />
          <div className="form-main-container">
            <form className="form-container" onSubmit={this.submitForm}>
              <img
                src="https://res.cloudinary.com/dw563hktd/image/upload/v1670926784/book-hub-logo_supztj.jpg"
                alt="login website logo"
                className="book-hub-logo"
              />
              <div className="input-container">
                <label className="input-label" htmlFor="username">
                  Username*
                </label>
                <input
                  type="text"
                  id="Username"
                  className="input-field"
                  placeholder="username"
                  value={username}
                  onChange={this.onChangeUsername}
                />
              </div>
              <div className="input-container">
                <label className="input-label" htmlFor="password">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  className="input-field"
                  placeholder="password"
                  value={password}
                  onChange={this.onChangePassword}
                />
                {showSubmitError && <p className="error-message">{errorMsg}</p>}
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </>
    )
  }
}

export default LoginForm
