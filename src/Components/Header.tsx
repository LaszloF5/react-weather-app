import React from 'react';
import "../Styles/Header.css";
import { Link } from "react-router-dom";

interface HeaderProps {
    setToggleLocationForm: React.Dispatch<React.SetStateAction<boolean>>;
    handleReminder: () => void;
}

const Header = ({setToggleLocationForm, handleReminder}: HeaderProps) => {

    const handleClick = (): void => {
        setToggleLocationForm(false);
    }
    
    return (
        <header className='header'>
          <nav className='header-nav'>
            <ul className='header-nav-ul'>
                <li className='header-nav-ul_li'>
                    <Link className='header-nav-ul_li_link' to="/" onClick={handleReminder}>Home</Link>
                </li>
                <li className='header-nav-ul_li'>
                    <Link className='header-nav-ul_li_link' to="/weekly-forecast">Weekly forecast</Link>
                </li>
                <li className='header-nav-ul_li'>
                    <Link className='header-nav-ul_li_link' to="/hour-to-hour-forecast">Hour to hour forecast</Link>
                </li>
                <li className='header-nav-ul_li'><button className="header-button" onClick={handleClick}>Search other city</button></li>
            </ul>
          </nav>
        </header>
    )
}

export default Header;