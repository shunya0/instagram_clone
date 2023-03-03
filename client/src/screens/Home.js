import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthenticationContext from "../contexts/auth/Auth.context";
import Navbar from "../components/Navbar";
import { config as axiosConfig, ALL_POST_URL, ALL_LIKES } from "../config/constants";
// Material-UI Components
import { makeStyles } from "@material-ui/core/styles";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// Material-UI Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import SendIcon from "@material-ui/icons/Send";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";

// General style
const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 500,
		margin: "20px auto",
		"& .MuiTextField-root": {
			width: "100%",
		},
		"& .MuiOutlinedInput-multiline": {
			paddingTop: "8px",
			paddingBottom: "8px",
			marginTop: "5px",
			marginLeft: "5px",
			marginRight: "5px",
		},
		"& .MuiCardContent-root:last-child": {
			paddingBottom: "10px",
		},
		"& .MuiDivider-middle": {
			marginBottom: "4px",
		},
		"& .MuiListItem-root": {
			padding: "0px 16px",
		},
		"& .MuiCardContent-root": {
			paddingTop: "0px",
			paddingBottom: "5px",
		},
		"& .MuiIconButton-root:focus": {
			backgroundColor: "rgba(0, 0, 0, 0)",
		},
	},
	header: {
		padding: "10px",
	},
	media: {
		//height: 0,
		paddingTop: "56.25%", // 16:9
		height: "max-content",
	},
	likeBar: {
		height: "25px",
		paddingTop: "0px",
		marginTop: "8px",
		marginLeft: "2px",
		paddingLeft: "0px",
		paddingBottom: "4px",
	},
	comments: {
		display: "flex",
		paddingTop: "0px",
		paddingLeft: "12px",
		paddingRight: "0px",
	},
	comment_item_see_more: {
		width: "35%",
		cursor: "pointer",
	},
	comments_icon_see_more: {
		height: "17px",
		width: "17px",
		paddingTop: "4px",
		paddingBottom: "3px",
	},
	comments_icon: {
		height: "30px",
		paddingLeft: "0px",
		paddingTop: "13px",
		paddingRight: "8px",
		paddingBottom: "0px",
	},
	inline: {
		display: "inline",
		fontWeight: "600",
	},
	avatar: {
		height: "40px",
	},
	links: {
		textDecoration: "none",
	},
}));

const Item = (props) =>{
	const classes = useStyles();
	return (
		<CardMedia
			className={classes.media}
			image={`data:${props.item.PhotoType};base64,${props.item.image}`}
			title="Image"
		/>
	)
}

const Home = () => {
	const classes = useStyles();
	const { state, dispatch } = useContext(AuthenticationContext);

	const [data, setData] = useState([]);
	const [likes, setLikes] = useState([]);

	const config = axiosConfig(localStorage.getItem("jwt"));

	useEffect(() => {
		axios.get(ALL_POST_URL, config).then((res) => {
			console.log(res.data.response);
			if (res.data.response) {

				setData(res.data.response);
			} else {
				setData([]);
			}
		})
	}, []);

	const likePost = (postId, userId) => {
		axios.put(`http://localhost:5000/like/`, {postId, userId}, config)
			.then((result) => {
				const newData = data.map((item) => {
					if (postId === item.posts_id) item.like = true;
					return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const unlikePost = (postId, userId) => {
		axios.put(`http://localhost:5000/Unlike`, { postId, userId }, config)
			.then((res) => {
				const newData = data.map((item) => {
					if (postId == item.posts_id) item.like = false;
					return item;
				});
				setData(newData);
			})
			.catch((err) => console.log(err));
	};

	const deletePost = (postId) => {
		axios.delete(`http://localhost:5000/deletepost/${postId}`, config).then((res) => {
			const newData = data.filter((item) => {
				return item._id !== res.data;
			});
			setData(newData);
		});
	};

	return (
		<>
			<Navbar />
			{data.map((item) => (
				<div className="home" key={item.posts_id}>
					<Card className={classes.root}>
						<CardHeader
							className={classes.header}
							avatar={
								<Avatar>
									<img
										className={classes.avatar}
										alt=""
									/>
								</Avatar>
							}
							
							subheader={Date(item.created_at)}
						/>

						<Carousel>
							{
								item.items.map( (item, i) => <Item key={i} item={item} />)
							}
						</Carousel>

						<CardActions className={classes.likeBar} disableSpacing>
							{item.like ? (
								<IconButton
									aria-label="Like"
									color="secondary"
									onClick={() => {
										unlikePost(item.posts_id, item.users_id);
									}}
								>
									<FavoriteIcon />
								</IconButton>
							) : (
								<IconButton
									aria-label="Like"
									onClick={() => {
										likePost(item.posts_id, item.users_id);
									}}
								>
									<FavoriteBorderIcon />
								</IconButton>
							)}
							
							
						</CardActions>

						<CardContent>
							<Typography variant="subtitle2" display="block" gutterBottom>
								{item.likes && item.likes.length} Likes
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								{item.Body}
							</Typography>
						</CardContent>

					</Card>
				</div>
			))}
		</>
	);
};

export default Home;
