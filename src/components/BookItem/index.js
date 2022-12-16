import {Link} from 'react-router-dom'

import {BsFillStarFill, BsFillHeartFill} from 'react-icons/bs'

import './index.css'

const BookItem = props => {
  const {bookDetails} = props
  const {id, title, readStatus, rating, authorName, coverPic} = bookDetails
  return (
    <>
      <Link to={`/books/${id}`} className="book-item-link">
        <li className="book-list-item-container">
          <div className="book-item-img">
            <button className="book-item-btn" type="button">
              <img src={coverPic} className="book-item-cover-pic" alt={title} />
            </button>
          </div>
          <div className="book-item-details-card-container">
            <h1 className="book-item-title">{title}</h1>
            <p className="book-item-author-name">{authorName}</p>
            <div className="book-item-avg-rating-container">
              <p className="book-item-avg-rating">Avg Rating</p>
              <BsFillStarFill className="book-item-start-icon" />
              <p className="book-item-rating">{rating}</p>
            </div>
            <p className="book-item-status-heading">
              Status: <span className="book-item-status">{readStatus}</span>
            </p>
          </div>
        </li>
      </Link>
    </>
  )
}
export default BookItem
