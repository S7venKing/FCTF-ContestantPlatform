import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  API_GET_DATE_CONFIG,
  BASE_URL,
  GET_CHALLENGE_LIST_PATH,
} from "../../constants/ApiConstant";
import ApiHelper from "../../utils/ApiHelper";
import ChallengeTopics from "./ChallengeTopics";

const ChallengeList = () => {
  const { categoryName } = useParams(); // Lấy `abcxyz` từ URL, đặt tên là `category`
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isContestActive, setIsContestActive] = useState(false);
  useEffect(() => {
    const fetchChallenge = async () => {
      const api = new ApiHelper(BASE_URL);
      try {
        const response = await api.get(
          GET_CHALLENGE_LIST_PATH + encodeURIComponent(categoryName)
        );
        setChallenges(response.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(true);
      }
    };

    fetchChallenge();
  }, []);

  useEffect(() => {
    const fetchDateConfig = async () => {
      const api = new ApiHelper(BASE_URL);
      try {
        const response = await api.get(`${API_GET_DATE_CONFIG}`);
        if (response.isSuccess) {
          const { message, start_date, end_date } = response;

          if (message === "CTFd has not been started" && start_date) {
            const startDate = new Date(start_date * 1000);
            if (new Date() < startDate) {
              setStatusMessage("Contest is starting soon!");
              setIsContestActive(false);
            }
          } else if (message === "CTFd has been started" && end_date) {
            const endDate = new Date(end_date * 1000);
            if (new Date() < endDate) {
              setIsContestActive(true);
              setStatusMessage("The contest is ongoing!");
            }
          } else {
            setStatusMessage("The contest has ended.");
            setIsContestActive(false);
          }
        } else {
          setStatusMessage("Error fetching contest details.");
        }
      } catch (error) {
        setStatusMessage("Error connecting to the server.");
        console.error("Fetch error:", error);
      }
    };

    fetchDateConfig();
  }, []);

  const svgPath = `/src/assets/map/${categoryName}.svg`; // Điều chỉnh đường dẫn đúng
  const defaultSvgTemplate = `/src/assets/map/template-map.svg`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <h1 className="text-2xl font-bold text-center mt-4">{categoryName}</h1>
      {/* Display the SVG file */}
      <div>
        <img
          className="p-3 rounded-lg"
          src={svgPath || defaultSvgTemplate}
          alt="Image"
          onError={(e) => (e.target.src = defaultSvgTemplate)}
        />
      </div>

      {/* Display markers */}
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          style={{
            position: "absolute",
            top: `${challenge.y || Math.floor(Math.random() * 500)}px`,
            left: `${challenge.x || Math.floor(Math.random() * 500)}px`,
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            width: "24px",
            height: "24px",
          }}
        >
          <Link
            to={`/challenge/${challenge.id}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-md px-4 py-2">
                  <span className="text-gray-700 font-bold">
                    {challenge.name}
                  </span>
                  <div className="w-6 h-6 fill-current text-red-500 absolute bottom-0 right-2"></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ChallengeList;
