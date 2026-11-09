import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { StoreProvider, useStore } from './context/StoreContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Compare from './pages/Compare.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Account from './pages/Account.jsx'
import Orders from './pages/Orders.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import FAQ from './pages/FAQ.jsx'
import Policy from './pages/Policy.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'
import ScrollRestoration from './components/ScrollRestoration.jsx'

function AppRoutes() {
  const { currency } = useStore()
  return (
    <ScrollRestoration currency={currency}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="category/:slug" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:number" element={<OrderConfirmation />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="compare" element={<Compare />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="account" element={<Account />} />
          <Route path="account/orders" element={<Orders />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy-policy" element={<Policy slug="privacy-policy" />} />
          <Route path="terms" element={<Policy slug="terms" />} />
          <Route path="shipping-policy" element={<Policy slug="shipping-policy" />} />
          <Route path="return-policy" element={<Policy slug="return-policy" />} />
          <Route path="admin" element={<Admin />} />
          <Route path="shop-by-category" element={<Navigate to="/shop" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ScrollRestoration>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </AuthProvider>
  )
}
