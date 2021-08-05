import {
	Card, Avatar, Typography, CardHeader
} from '@material-ui/core'
import { Link } from 'react-router-dom'

import styled from 'styled-components'

export const PlainLink = styled(Link)`
	text-decoration: none;
	color: unset;
`

type BoardType = {
	boardName: string,
	logo: string,
}

type PropsType = {
	board: BoardType
}

export default function Board({ board }:PropsType) {
	return (
		<Card variant="outlined">
			<CardHeader
				avatar={
					<Avatar
						src={board.logo}
						style={{width: '40xp', height: '40px'}}>
							{ board.boardName[0].toUpperCase() }
					</Avatar>
				}
				title={
					<PlainLink to={`/b/${board.boardName}`}>
						<Typography>
							b/{ board.boardName }
						</Typography>
					</PlainLink>
				}
			/>
		</Card>
	)
}
