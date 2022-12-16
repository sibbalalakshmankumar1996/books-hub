import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Header from '../Header'
import './index.css'
import Footer from '../Footer'

const topRatedApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  autoplay: true,
  slidesToScroll: 1,
  slidesToShow: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 786,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {topRatedApiStatus: topRatedApiStatuses.initial, topRatedBooks: []}

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({topRatedApiStatus: topRatedApiStatuses.inProgress})
    const topRatedBooksApi = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(topRatedBooksApi, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const booksList = fetchedData.books
      const updatedData = booksList.map(eachBook => ({
        id: eachBook.id,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      this.setState({
        topRatedApiStatus: topRatedApiStatuses.success,
        topRatedBooks: updatedData,
      })
    } else {
      this.setState({topRatedApiStatus: topRatedApiStatuses.failure})
    }
  }

  onClickRetry = () => {
    this.getTopRatedBooks()
  }

  onClickFindBooks = () => {
    const {history} = this.props
    history.push('/shelf')
  }

  renderSliderProgressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderBooksFailureView = () => (
    <div className="top-rated-books-failure-container">
      <img
        src="https://res.cloudinary.com/dw563hktd/image/upload/v1671122104/Group_7522_jstfvx.jpg"
        alt="failure view"
      />
      <p className="no-match-paragraph">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="try-again-button"
        onClick={this.onClickRetry}
      >
        Try Again
      </button>
    </div>
  )

  renderSliderSuccessView = () => {
    const {topRatedBooks} = this.state

    console.log(topRatedBooks)
    return (
      <div className="top-rated-book-item-container">
        <Slider {...settings}>
          {topRatedBooks.map(eachBook => {
            const {id, coverPic, title, authorName} = eachBook

            return (
              <Link to={`/books/${id}`} className="top-rated-book-link">
                <div className="book-item-container" key={id}>
                  <img
                    className="top-rated-book-img"
                    src={coverPic}
                    alt="coverPic"
                  />
                  <h3 className="top-rated-book-name">{title}</h3>
                  <p className="top-rated-book-author">{authorName}</p>
                </div>
              </Link>
            )
          })}
        </Slider>
      </div>
    )
  }

  renderSlider = () => {
    const {topRatedApiStatus} = this.state

    switch (topRatedApiStatus) {
      case topRatedApiStatuses.success:
        return <>{this.renderSliderSuccessView()}</>
      case topRatedApiStatuses.inProgress:
        return <>{this.renderSliderProgressView()}</>
      case topRatedApiStatuses.failure:
        return <> {this.renderSliderViewFailure()}</>
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header home />
        <div className="home-page-bg-container">
          <div className="responsive-home-page-top">
            <h1 className="home-heading" key="title">
              Find Your Next Favorite Books?
            </h1>
            <p className="home-paragraph">
              You are in the right place. Tell us what titles or genres you have
              enjoyed in the past, and we will give you surprisingly insightful
              recommendations.
            </p>
            <button
              className="home-find-responsive-books-btn"
              type="button"
              onClick={this.onClickFindBooks}
            >
              Find Books
            </button>
          </div>

          <div>
            <div className="home-top-rated-container">
              <div className="top-rated-heading-container">
                <h1 className="top-rated-heading">Top Rated Books</h1>
                <button
                  className="home-find-desktop-books-btn"
                  type="button"
                  onClick={this.onClickFindBooks}
                >
                  Find Books
                </button>
              </div>
              <div className="slick-container">{this.renderSlider()}</div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default Home
