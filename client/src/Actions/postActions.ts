import {
	UPVOTE_POST,
	DOWNVOTE_POST,
	SAVE_POST
} from '../Constants/postContants'

import { DispatchType } from '../Store'

export const upvote = (postId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: UPVOTE_POST,
		payload: postId
	})
}

export const downvote = (postId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: DOWNVOTE_POST,
		payload: postId
	})
}

export const save = (postId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: SAVE_POST,
		payload: postId
	})
}