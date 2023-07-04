import React, { useRef, useState , useEffect} from "react";
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import {Container, Card, Row, ProgressBar,  Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';
import { FaCalendar, FaStar, FaTrophy, FaMedal } from 'react-icons/fa';


const ProfilePage = (props) => {
	const [userName, setUserName] = useState(null);
	const navigate = useNavigate();
	const role = useRef('');
	const [score, setScore] = useState([]);

	const joinDate = 'Joined: July 4, 2023';
	const statistics = [
		{ title: 'Day Streak', value: '30', icon: FaCalendar, color: '#F9C80E' },
		{ title: 'Total XP', value: '5000', icon: FaStar, color: '#FF6B6B' },
		{ title: 'Current League', value: 'Gold', icon: FaTrophy, color: '#7A77FF' },
		{ title: 'Top 3 Finishes', value: '10', icon: FaMedal, color: '#43AA8B' },
	  ];
  const achievements = [
	{ title: 'Beginner', icon: FaStar, color: '#32CC8F', progress: 20 },
    { title: 'Intermediate', icon: FaStar, color: '#845EC2', progress: 40 },
    { title: 'Advanced', icon: FaStar, color: '#FF6F91', progress: 60 },
  ];

	const [profilePicture, setProfilePicture] = useState('');
  
	const handleProfilePictureUpload = (event) => {
	  const file = event.target.files[0];
	  // Perform necessary actions with the uploaded file
	  // For example, you can upload the file to a server or store it in the state
	  setProfilePicture(URL.createObjectURL(file));
	};

	const getScore = () => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/allScoresForUser",
		}).then((res) => {
			// console.log('score data',res.data);
			setScore(res.data);
		});
	};

	////to authenticate user before allowing him to enter the home page
	////if he is not redirect him to login page
	useEffect ( () => {
		// console.log("in use effect");
		Axios({
			method: "GET",
			withCredentials: true,
			url: "/server/login",
		}).then(function (response) {
			if (response.data.redirect == '/login') {
				// console.log("Please log in");
				navigate(`/auth/login`);
			} 
			else{
                setUserName(response.data.user.username);
				role.current = response.data.user.role;
				getScore();
			}
		}); 
		
	}, []);
		
	return (
		<>
		<Helmet><title>Profile Page</title></Helmet>
		<Navbar  proprole={role}/>

		<div className="container mt-5">
			<div className="row">
			  <div className="col-md-12 mb-6">
				{userName ? (
				   <Card className="welcome-card">
				   <Card.Body className="d-flex align-items-center">
				   <div className="profile-picture">
                <label htmlFor="profile-picture-upload">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="rounded-circle"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/100"
                      alt="Profile"
                      className="rounded-circle"
                    />
                  )}
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePictureUpload}
                />
              </div>
					 <div className="user-info ml-5">
					   <h1>{userName}</h1>
					   <p>{joinDate}</p>
					 </div>
					 <div className="ml-auto">
						 <Link to="/updateemail"><Button variant="primary">Edit Profile</Button></Link>              
					 </div>
				   </Card.Body>
				 </Card>
				) : (
				  <Card className="welcome-card">
					<Card.Body>
					  <h1>Welcome Back</h1>
					</Card.Body>
				  </Card>
				)}
			  </div>
			</div>

			<div className="row mt-5">
				<div className="col-md-12">
					<h3>Your Learnings</h3>
					<div className="row row-cols-1 row-cols-md-3 g-4">
					{score? (score).map((score, i) =>
					<>
					<br/>
					<Card key={i}>
						<Card.Header as="h5">{score.skill.split("_").join(" ")}</Card.Header>
						<Card.Body>
							<Card.Title>{score.category.split("_").join(" ")}</Card.Title>
							<Card.Text>You scored {score.points} points in {score.sub_category.split("_").join(" ")}</Card.Text>
						</Card.Body>
					</Card>
					</>
					):null}
					</div>
				</div>
			</div>

			<Row>
				<Col md={6}>
				<h3>Statistics</h3>
				<Row>
					{statistics.map((stat, index) => (
					<Col md={6} key={index}>
						<Card className="mb-4" style={{ backgroundColor: stat.color }}>
						<Card.Body>
							<div className="d-flex align-items-center">
							<div className="icon-container">
								<stat.icon size={24} color="#FFF" />
							</div>
							<div className="ml-4">
								<Card.Title>{stat.title}</Card.Title>
								<Card.Text>{stat.value}</Card.Text>
							</div>
							</div>
						</Card.Body>
						</Card>
					</Col>
					))}
				</Row>
				</Col>
				<Col md={6}>
				<h3>Achievements</h3>
				<Card>
            <Card.Body>
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="achievement-card"
                  style={{ backgroundColor: achievement.color, padding: "10px", marginBottom: "10px", borderRadius: "10px" }}
                >
                  <div className="d-flex align-items-center">
                    <div className="icon-container mr-5">
                      <achievement.icon size={24} color="#FFF" />
                    </div>
                    <div className="achievement-info">
                      <h5>{achievement.title}</h5>
                      <ProgressBar
                        now={achievement.progress}
                        label={`${achievement.progress}%`}
                        variant="light"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
				</Col>
			</Row>


		  </div>
		</>
	);
};

export default ProfilePage; 
