import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill, BsFillHeartFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import Footer from '../Footer'

import './index.css'

const bookDetailsApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookItemDetails extends Component {
  state = {
    bookDetailsData: {},
    bookDetailsApiStatus: bookDetailsApiStatuses.initial,
  }

  componentDidMount() {
    this.getBookItemDetails()
  }

  getBookItemDetails = async () => {
    this.setState({bookDetailsApiStatus: bookDetailsApiStatuses.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const bookDetailsApi = `https://apis.ccbp.in/book-hub/books/${id}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(bookDetailsApi, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        bookDetails: {
          id: fetchedData.book_details.id,
          authorName: fetchedData.book_details.author_name,
          title: fetchedData.book_details.title,
          coverPic: fetchedData.book_details.cover_pic,
          aboutBook: fetchedData.book_details.about_book,
          rating: fetchedData.book_details.rating,
          aboutAuthor: fetchedData.book_details.about_author,
          readStatus: fetchedData.book_details.read_status,
        },
      }
      this.setState({
        bookDetailsData: updatedData,
        bookDetailsApiStatus: bookDetailsApiStatuses.success,
      })
    } else {
      this.setState({bookDetailsApiStatus: bookDetailsApiStatuses.failure})
    }
  }

  onClickRetry = () => {
    this.getBookItemDetails()
  }

  renderBookDetailsInProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderBookDetailsFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        className="top-rated-books-failure-image"
        src="https://res.cloudinary.com/dw563hktd/image/upload/v1671122104/Group_7522_jstfvx.jpg"
        alt="failure view"
      />
      <p className="failure-view-paragraph">
        Something went wrong. Please try again
      </p>
      <button
        className="try-again-button"
        onClick={this.onClickRetry}
        type="button"
      >
        Try Again
      </button>
    </div>
  )

  renderBookDetailsSuccessView = () => {
    const {bookDetailsData} = this.state
    const {bookDetails} = bookDetailsData
    console.log(bookDetails)
    const {
      authorName,
      coverPic,
      aboutBook,
      rating,
      readStatus,
      aboutAuthor,
      title,
      id,
    } = bookDetails

    return (
      <>
        <div className="book-details-card-container-desktop">
          <div className="book-details-card-container">
            <div className="book-details-container">
              <img src={coverPic} alt={title} className="book-details-image" />
              <div className="container1">
                <h1 className="book-title">{title}</h1>
                <p className="book-details-author-name">{authorName}</p>
                <div className="book-details-rating-container">
                  <p className="book-details-abg-rating-heading">Avg rating </p>
                  <BsFillStarFill className="book-details-star-icon" />
                  <p className="book-details-rating"> {rating}</p>
                </div>
                <p className="book-details-status-heading">
                  Status:{' '}
                  <span className="book-details-status">{readStatus}</span>
                </p>
              </div>
            </div>
            <div className="container2">
              <hr name="horizontal-line" />
              <div className="book-author-details">
                <h1 className="about-heading">About Author</h1>
                <p className="about-paragraph">{aboutAuthor}</p>
              </div>
              <div className="book-author-details">
                <h1 className="about-heading">About Book</h1>
                <p className="about-paragraph">{aboutBook}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderBookDetails = () => {
    const {bookDetailsApiStatus} = this.state

    switch (bookDetailsApiStatus) {
      case bookDetailsApiStatuses.success:
        return <> {this.renderBookDetailsSuccessView()} </>
      case bookDetailsApiStatuses.inProgress:
        return <>{this.renderBookDetailsInProgressView()}</>
      case bookDetailsApiStatuses.failure:
        return <>{this.renderBookDetailsFailureView()}</>
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header shelves />
        <div className="book-details-bg-container">
          {this.renderBookDetails()}
          <Footer />
        </div>
      </>
    )
  }
}

export default BookItemDetails
