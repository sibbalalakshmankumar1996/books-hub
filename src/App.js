import {Route, Switch} from 'react-router-dom'

import './App.css'

import Home from './components/Home'
import LoginForm from './components/LoginForm'
import BookShelves from './components/BookShelves'
import NotFound from './components/NotFound/index'
import BookItemDetails from './components/BookItemDetails'
import ProtectedRoute from './components/ProtectedRoute/index'

const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/shelf" component={BookShelves} />
      <ProtectedRoute exact path="/books/:id" component={BookItemDetails} />
      <Route component={NotFound} />
    </Switch>
  </>
)

export default App
