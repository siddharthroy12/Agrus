import {
	UPVOTE_COMMENT,
	DOWNVOTE_COMMENT,
} from '../Constants/commentConstants'

import { DispatchType } from '../Store'

export const upvoteComment = (commentId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: UPVOTE_COMMENT,
		payload: commentId
	})
}

export const downvoteComment = (commentId: string) => async (dispatch: DispatchType) => {
	dispatch({
		type: DOWNVOTE_COMMENT,
		payload: commentId
	})
}