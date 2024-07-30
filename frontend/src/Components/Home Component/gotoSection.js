import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {Link} from 'react-router-dom'
import "./home.css"; 

function Goto(){
    return(
    <>
     <section className="gotoSection">
     <div className="wrapperClass">           
    <div className="gotoHeading">
        <h1>Where you want to go ?</h1>
    </div>
    <div className="citySection flex">
        <div className="city flex">
            <Link>
                Delhi
                <FontAwesomeIcon
            className="iconColor"
            icon={"arrow-right"}
          ></FontAwesomeIcon>
                Chandhigarh
            </Link>
            <Link><FontAwesomeIcon
            className="iconColor"
            icon={"chevron-right"}
          ></FontAwesomeIcon></Link>
        </div>
        <div className="city flex">
            <Link>
                Mumbai
                <FontAwesomeIcon
            className="iconColor"
            icon={"arrow-right"}
          ></FontAwesomeIcon>
                Pune
            </Link>
            <span><FontAwesomeIcon
            className="iconColor"
            icon={"chevron-right"}
          ></FontAwesomeIcon></span>
        </div>
        <div className="city flex">
            <Link>
                Bengluru
                <FontAwesomeIcon
            className="iconColor"
            icon={"arrow-right"}
          ></FontAwesomeIcon>
                Chennai
            </Link>
            <Link><FontAwesomeIcon
            className="iconColor"
            icon={"chevron-right"}
          ></FontAwesomeIcon></Link>
        </div>
    </div>
    <div className="lastLine">
        <Link>See our most popular rides</Link>
    </div>
</div>
    </section>
    </>
    )
}

export default Goto;