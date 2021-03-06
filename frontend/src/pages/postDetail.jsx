import React, {useState} from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import CommentsList from '../components/comments/commentsList';
import MyModal from '../components/modal';
import uuid from "uuid";
import { actionCommentCreateApi } from '../redux/actions';
import { millisecondsToDate } from '../utils/dates';

const baseComment = {
	id: null,
    timestamp: Date.now(),
    author: "",
    body: ""
}
const baseCommentHide = ["id", "timestamp", "parentId"]

const PostDetail =  ({ post, loading, dispatchCommentCreateApi }) => {

	const [renderCreate, setRenderCreate] = useState(false);
	
	const toggleCreateModal = action => {
		setRenderCreate(action)
	}

	const formCreateNewCommentSubmitted = comment => {
		dispatchCommentCreateApi(comment)
	}

    const renderPost = () => {
        return (
            <>
			<h2 className={"textCenter"} >{`Post - ${post.title}`}</h2>
            <div className={"textCenter"}>
				<p> &nbsp; Title: {post.title}</p>
				<p> &nbsp; Body: {post.body}</p>
				<p> &nbsp; Author: {post.author}</p>
				<p> &nbsp; Number of comments: {post.commentCount}</p>
				<p> &nbsp; Current score: {post.voteScore}</p>
				<p> &nbsp; category: {post.category}</p>
				<p> &nbsp; Created: {millisecondsToDate(post.timestamp)}</p>
            </div>
            <CommentsList handlerNew={toggleCreateModal} post={post}/>
			{renderCreate && <MyModal 
								title={`${post.title} - New Comment`} 
								baseObject={{...baseComment, id: uuid.v4(), parentId: post.id}} 
								fieldsToHide={baseCommentHide}
								handleClose={toggleCreateModal} 
								submit={formCreateNewCommentSubmitted}/>}
            </>
        )
    }

    return post ? renderPost() : <p className={"textCenter"}>No post selected</p>
}

// to get the todo object from the state inside the redux and send to the component
const mapStateToProps = state => {
    return {post: state.posts.previewPost, loading: state.posts.loading}
  }

export default connect(
    mapStateToProps, 
    {dispatchCommentCreateApi: actionCommentCreateApi}
    )(PostDetail);

//All Proptypes of this object
PostDetail.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		voteScore: PropTypes.number.isRequired
	  }),
	loading: PropTypes.bool.isRequired
};