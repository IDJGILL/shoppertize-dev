import Footer from "../_components/footer/footer-container"
import HeaderContainer from "../_components/header/header-container"
// import FixedNavigationBar from "../_components/fixed-navigation-bar"

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="">
      <HeaderContainer />

      {children}

      {/* <FixedNavigationBar /> */}

      <Footer />
    </main>
  )
}
