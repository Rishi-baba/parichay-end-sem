import React, { useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavbarContext } from "../../context/NavContext";
import { AuthContext } from "../../context/AuthContext";
import gsap from "gsap";

const Navbar = () => {
  const navGreenRef = useRef(null);
  const loginGreenRef = useRef(null);
  const [navOpen, setNavOpen] = useContext(NavbarContext);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="z-50 fixed top-0 w-full">
      <div className="flex items-start justify-between">
        <div className="lg:p-1 p-0.5" style={{ marginTop: "-2px" }}>
          <Link to="/" className="lg:w-44 w-32 flex items-center gap-2 px-4 py-3 bg-black group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span style={{ fontFamily: 'font2, sans-serif', color: '#fff', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s' }} className="group-hover:text-purple-400">Parichay</span>
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          {/* Navigation Button */}
          <div
            onClick={() => {
              setNavOpen(true);
            }}
            onMouseEnter={() => {
              navGreenRef.current.style.height = "100%";
            }}
            onMouseLeave={() => {
              navGreenRef.current.style.height = "0%";
            }}
            className="lg:h-16 h-10 bg-black relative lg:w-[16vw] w-48 cursor-pointer"
          >
            <div
              ref={navGreenRef}
              className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] transition-all absolute top-0 h-0 w-full"
            ></div>
            <div className="relative h-full lg:px-12 px-8 flex flex-col justify-center items-end lg:gap-1.5 gap-0.5">
              <div className="lg:w-18 w-12 h-0.5 bg-white"></div>
              <div className="lg:w-10 w-6 h-0.5 bg-white"></div>
            </div>
          </div>

          {/* Login Button - Only show if not logged in */}
            {user ? (
              <div
                className="lg:h-12 h-8 bg-black relative lg:w-[16vw] w-48 cursor-pointer"
                onMouseEnter={() => {
                  if(loginGreenRef.current) loginGreenRef.current.style.height = "100%";
                }}
                onMouseLeave={() => {
                  if(loginGreenRef.current) loginGreenRef.current.style.height = "0%";
                }}
                onClick={logout}
              >
                <div ref={loginGreenRef} className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] transition-all absolute top-0 h-0 w-full"></div>
                <div className="relative h-full lg:px-12 px-8 flex flex-col justify-center items-center">
                  <div className="text-white lg:text-sm text-xs font-bold">LOGOUT</div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="lg:h-12 h-8 bg-black relative lg:w-[16vw] w-48 cursor-pointer block"
                onMouseEnter={() => {
                  if(loginGreenRef.current) loginGreenRef.current.style.height = "100%";
                }}
                onMouseLeave={() => {
                  if(loginGreenRef.current) loginGreenRef.current.style.height = "0%";
                }}
              >
                <div ref={loginGreenRef} className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] transition-all absolute top-0 h-0 w-full"></div>
                <div className="relative h-full lg:px-12 px-8 flex flex-col justify-center items-center">
                  <div className="text-white lg:text-sm text-xs font-bold">LOGIN</div>
                </div>
              </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
