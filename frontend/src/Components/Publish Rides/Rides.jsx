import { React } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Rides({ leaving, going }) {
  return (
    <>
      <div className="city flex">
        <Link>
          {leaving}
          <FontAwesomeIcon
            className="iconColor"
            icon={"arrow-right"}
          ></FontAwesomeIcon>
          {going}
        </Link>
        <Link>
          <FontAwesomeIcon
            className="iconColor"
            icon={"chevron-right"}
          ></FontAwesomeIcon>
        </Link>
      </div>
    </>
  );
}

