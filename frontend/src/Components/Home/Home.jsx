// import { Link } from "react-router-dom";
import "./home.css";
import MainSection from "../Home Component/mainSection1";
import GridSection from "../Home Component/gridSection"
import Goto from '../Home Component/gotoSection';
import Footer from '../Home Component/Footer';
import Search from "../Search Rides/SearchForm";
import '../Home Component/meadiQuerry.css'

// import {Form } from 'react-router-dom';



function Home() {
  return (
    <>
      <main className="heroSection ">
        <div className="headingText">
          <h1>Your pick of rides at low prices</h1>
        </div>
       <Search></Search>
      </main>
      <MainSection/>
      <Goto/>
      <GridSection/>
      <Footer/>
    </>
  );
}

export default Home;
