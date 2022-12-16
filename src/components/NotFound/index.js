import {Link, withRouter} from 'react-router-dom'
import './index.css'

const NotFound = props => {
  const onClickBackToHome = () => {
    const {history} = props
    history.replace('/')
  }
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <img
          src="https://res.cloudinary.com/dw563hktd/image/upload/v1671165595/Group_7484_iy1ymr.jpg"
          alt="not found"
          className="not-found-bg-image"
        />
        <h2 className="pageNotFound-heading">Page Not Found</h2>
        <p className="pageNotFound-description">
          we are sorry, the page you requested could not be found. Please go
          back to the homepage.
        </p>
        <Link to="/">
          <button
            type="button"
            onClick={onClickBackToHome}
            className="not-found-button"
          >
            Go Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}

export default withRouter(NotFound)
