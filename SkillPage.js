import React, { useRef, useState , useEffect} from "react";
import {useParams} from 'react-router-dom';
import Axios from "axios";
import {Link, useNavigate } from 'react-router-dom';
import {Badge, Card, Button, Col, Image} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import Navbar from '../components/Navbar';

const SkillPage = () => {
    const {skillName} = useParams();
    const navigate = useNavigate();
	const role = useRef('');
	// const categories = useRef([]);
	const skill = useRef([]);
	const [categories, setCategories] = useState([]);
	const checkIsCompleted = useRef([]);
	const getSkillBySkillName = (score) => {
		Axios({
			method: "GET",
			withCredentials: true,
			url: `/server/skills/${skillName}`,
		}).then((res) => {
			// console.log("skill name", skillName);
			// console.log("skill is ", res.data.data[0]);
			// categories.current = res.data.data[0].categories;
			// console.log("categories - ", categories.current);
			skill.current = (res.data.data[0]);
			// console.log('skill.current',skill.current );
			setCategories(res.data.data[0].categories);

			var tempCheckIsCompleted = [];
				var completedSubCategories = [];
				score.forEach((score) => {
					if(score.skill === skillName )
					completedSubCategories = completedSubCategories.concat({category: score.category, sub_category: score.sub_category});
				});
				// console.log('completedSubCategories', completedSubCategories);
				// console.log('skill.current',skill.current );
				skill.current.categories.forEach(category =>{
					var n1 = 0, n2 = 0;
					skill.current.sub_categories.forEach((sub_category) =>{
						if(sub_category.category === category)	n1++;
					});
					completedSubCategories.forEach((sub_category) =>{
						if(sub_category.category === category)	n2++;
					});
					// console.log('category', category, n1, n2);
					if(n1 === n2){
						tempCheckIsCompleted = tempCheckIsCompleted.concat(category);
					}
				});
				checkIsCompleted.current = tempCheckIsCompleted;
				// console.log('checkIsCompleted', checkIsCompleted.current);
		});
	};

	const handleCategorySelection=(category)=>{ 
        // console.log("handleCategorySelection",category);
		navigate(`/skills/${skillName}/${category}`);
    }

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
				// console.log("Already logged in");
				getSkillBySkillName(response.data.user.score);
				role.current = response.data.user.role;
			}
		}); 
		
	}, []);

    return ( 
        <>
		<Helmet><title>{skillName.split("_").join(" ")}</title></Helmet>
		<Navbar  proprole={role}/>
        <div className="skill-page">
			<br/>
			<h2 className="text-center"><Badge pill bg="light">{skillName.split("_").join(" ")}</Badge></h2>
			
			{(categories)? ((categories).map((category, i) =>
            <>
			<br/>
			<div key={i}>
			<Card >
				<Card.Header as="h5">{category.split("_").join(" ")}{' '}{checkIsCompleted.current.includes(category)? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg> : null}</Card.Header>
				<Card.Body>
					{/* <Card.Title>{category}</Card.Title> */}
					{/* <Card.Text>
					With supporting text below as a natural lead-in to additional content.
					</Card.Text> */}
					<Button onClick={() => handleCategorySelection(category)}>Let's Go</Button> 
				</Card.Body>
			</Card>
			</div>
			</>
            )):null}
           
		   <br></br>
        </div>
		
        </>
     );
}
 
export default SkillPage;