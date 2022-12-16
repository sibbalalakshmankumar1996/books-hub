import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import BookItem from '../BookItem'

import './index.css'
import Footer from '../Footer'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]
const bookApiStatuses = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookShelves extends Component {
  state = {
    activeFilter: bookshelvesList[0].value,
    activeFilterLabel: bookshelvesList[0].label,
    booksApiStatus: bookApiStatuses.initial,
    booksData: {},
    search: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getBooksApiData()
  }

  updatedBooksList = booksList =>
    booksList.map(eachBook => ({
      id: eachBook.id,
      title: eachBook.title,
      readStatus: eachBook.read_status,
      rating: eachBook.rating,
      authorName: eachBook.author_name,
      coverPic: eachBook.cover_pic,
    }))

  getBooksApiData = async () => {
    this.setState({booksApiStatus: bookApiStatuses.inProgress})

    const {search, activeFilter} = this.state
    const booksApi = `https://apis.ccbp.in/book-hub/books?shelf=${activeFilter}&search=${search}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(booksApi, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        books: this.updatedBooksList(fetchedData.books),
        total: fetchedData.total,
      }

      this.setState({
        booksData: updatedData,
        booksApiStatus: bookApiStatuses.success,
      })
    } else {
      this.setState({booksApiStatus: bookApiStatuses.failure})
    }
  }

  onClickRetry = () => {
    this.getBooksApiData()
  }

  onChangeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchBooks = () => {
    this.setState(
      prevState => ({search: prevState.searchInput}),
      this.getBooksApiData,
    )
  }

  renderBooksProgressView = () => (
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

  renderTheListOfBooks = () => {
    const {booksData} = this.state
    const {books} = booksData

    return (
      <ul className="bookList-container">
        {books.map(eachBook => (
          <BookItem key={eachBook.id} bookDetails={eachBook} />
        ))}
      </ul>
    )
  }

  renderNoMatchBooks = () => {
    const {searchInput} = this.state
    return (
      <div className="no-match-found-container">
        <img
          src="https://res.cloudinary.com/dw563hktd/image/upload/v1671120650/Group_kx05l9.jpg"
          alt="no books"
          className="no-match-image"
        />
        <p className="no-match-paragraph">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

  renderBooksSuccessView = () => {
    const {booksData} = this.state
    const {total} = booksData
    if (total !== 0) {
      return <> {this.renderTheListOfBooks()} </>
    }
    return <> {this.renderNoMatchBooks()} </>
  }

  renderBooks = () => {
    const {booksApiStatus} = this.state
    switch (booksApiStatus) {
      case bookApiStatuses.success:
        return <> {this.renderBooksSuccessView()}</>
      case bookApiStatuses.inProgress:
        return <>{this.renderBooksProgressView()}</>
      case bookApiStatuses.failure:
        return <>{this.renderBooksFailureView()}</>
      default:
        return null
    }
  }

  render() {
    const {activeFilter, searchInput, activeFilterLabel} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header shelves />
        <div>
          <div className="book-shelves-bg-container-lg">
            <div className="search-input-container-mobile">
              <input
                placeholder="Search"
                type="search"
                className="search-input"
                onChange={this.onChangeInput}
                value={searchInput}
              />
              <button
                className="search-btn"
                onClick={this.onSearchBooks}
                type="button"
                testid="searchButton"
              >
                <BsSearch className="search=icon" />
              </button>
            </div>
            <div className="book-shelves-filter-container">
              <h1 className="bookshelves-heading" key="title">
                Bookshelves
              </h1>
              <ul className="filter-un-order-list-container">
                {bookshelvesList.map(eachItem => {
                  const activeFilterClass =
                    activeFilter === eachItem.value ? 'active-filter-lg' : ''
                  const onClickedFilter = () => {
                    this.setState(
                      {
                        activeFilter: eachItem.value,
                        activeFilterLabel: eachItem.label,
                      },
                      this.getBooksApiData,
                    )
                  }
                  return (
                    <li className="active-filter-list" key={eachItem.label}>
                      <button
                        className={`filter-button ${activeFilterClass}`}
                        onClick={onClickedFilter}
                        type="button"
                      >
                        {eachItem.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="large-container">
              <div className="filtered-books-search-input-container-lg">
                <div>
                  <h1 className="filtered-books-heading">
                    {activeFilterLabel} Books
                  </h1>
                </div>

                <div className="search-input-container">
                  <input
                    placeholder="Search"
                    type="search"
                    className="search-input"
                    onChange={this.onChangeInput}
                    value={searchInput}
                  />
                  <button
                    className="search-btn"
                    onClick={this.onSearchBooks}
                    type="button"
                    testid="searchButton"
                  >
                    <BsSearch className="search=icon" />
                  </button>
                </div>
              </div>
              <div>{this.renderBooks()}</div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default BookShelves
