import HeaderBackNavigator from "./header-back-navigator"
import HeaderDropDownMenu from "./header-dropdown-menu"
import HeaderLogo from "../brand-logo"
import HeaderSearchBar from "./header-searchbar"
// import HeaderSubBarCategories from "./sub-bar-categories"
import { HamMenuTrigger } from "./sidebar-menu-triggers"
// import SideBarRenderer from "./sidebar/side-bar-renderer"

export default function Header() {
  return (
    <>
      <header className="sticky inset-x-0 top-0 z-[100000] bg-white shadow-md">
        <div className="container flex h-14 items-center justify-between gap-10 pl-0 md:pl-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <HeaderBackNavigator />

              <HamMenuTrigger />

              <HeaderLogo />
            </div>
          </div>

          <HeaderSearchBar />

          <HeaderDropDownMenu />
        </div>

        {/* <HeaderSubBarCategories /> */}
      </header>

      {/* <SideBarRenderer /> */}
    </>
  )
}
