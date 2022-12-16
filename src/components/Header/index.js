import {Component} from 'react'

import './index.css'
import Cookies from 'js-cookie'

import {Link, withRouter} from 'react-router-dom'
import {FiMenu} from 'react-icons/fi'
import {RiCloseCircleFill} from 'react-icons/ri'

class Header extends Component {
  state = {displayNavbar: false}

  onClickMenu = () => {
    this.setState(prevState => ({
      displayNavbar: !prevState.displayNavbar,
    }))
  }

  onClickCross = () => {
    this.setState({displayNavbar: false})
  }

  clickLogout = () => {
    const {history} = this.props
    history.replace('/login')
    Cookies.remove('jwt_token')
  }

  render() {
    const {home, shelves} = this.props
    const activeHome = home ? 'active-tab' : ''
    const activeShelves = shelves ? 'active-tab' : ''
    const {displayNavbar} = this.state
    return (
      <>
        <div>
          <div className="header-container">
            <div className="header-website-logo1">
              <Link to="/">
                <img
                  src="https://res.cloudinary.com/dw563hktd/image/upload/v1670926784/book-hub-logo_supztj.jpg"
                  alt="website logo"
                  className="header-website-logo"
                />
              </Link>
            </div>
            <ul className="tabs-container">
              <Link className={`link ${activeHome}`} to="/">
                <li>Home</li>
              </Link>
              <Link className={`link ${activeShelves}`} to="/shelf">
                <li>Bookshelves</li>
              </Link>
              <li className="list-item">
                <button
                  className="logout-btn"
                  onClick={this.clickLogout}
                  type="button"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          <div className="header-navbar-responsive-container">
            <div className="header-nav-container">
              <Link to="/">
                <img
                  className="header-nav-bar-website-logo"
                  src="https://res.cloudinary.com/dw563hktd/image/upload/v1670926784/book-hub-logo_supztj.jpg"
                  alt="website logo"
                />
              </Link>
              <FiMenu className="menu-icon" onClick={this.onClickMenu} />
            </div>
            {displayNavbar && (
              <>
                {/* <div className="header-navbar-tabs-container">
                  <Link className="link" to="/">
                    <p>Home</p>
                  </Link>
                  <Link className="link" to="/shelf">
                    <p>BookShelves</p>
                  </Link>
                  <button
                    className="logout-btn"
                    onClick={this.clickLogout}
                    type="button"
                  >
                    Logout
                  </button>
                  <RiCloseCircleFill
                    onClick={this.onClickCross}
                    className="cross-icon"
                  />
                </div> */}
                <ul className="tabs-mobile-container">
                  <Link className={`link ${activeHome}`} to="/">
                    <li>Home</li>
                  </Link>
                  <Link className={`link ${activeShelves}`} to="/shelf">
                    <li>Bookshelves</li>
                  </Link>
                  <li className="list-item">
                    <button
                      className="logout-btn"
                      onClick={this.clickLogout}
                      type="button"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </>
    )
  }
}
export default withRouter(Header)
