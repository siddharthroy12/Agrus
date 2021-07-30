import {
	UPVOTE_POST,
	DOWNVOTE_POST,
	SAVE_POST
} from '../Constants/postContants'

import { DispatchType } from '../Store'

export const upvotePost = (postId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: UPVOTE_POST,
		payload: postId
	})
}

export const downvotePost = (postId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: DOWNVOTE_POST,
		payload: postId
	})
}

export const savePost = (postId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: SAVE_POST,
		payload: postId
	})
}