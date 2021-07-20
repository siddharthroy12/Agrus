import styled from 'styled-components'
import { Paper, Typography } from '@material-ui/core'
import { ReactNode } from 'react'

const Wrapper = styled.aside`
	width: 30rem;
	margin-left: 0.5rem;

	& > * {
		margin-bottom: 1rem;
	}

	@media screen and (max-width: 850px) {
		display: none;
	}
`

const Divider = styled(Paper)`
	padding: 0.5rem;
`

const MoreInfoBox = styled(Paper)`
	padding: 1rem;
`

const MoreInfoRow = styled.div`
	display: flex;

	& > * {
		width: 100%;
	}
`

type propsType = {
	children: ReactNode
}

export default function SubContainerAside({ children }: propsType) {
	return (
		<Wrapper>
			{ children }
			<Divider elevation={3}/>
			<MoreInfoBox elevation={3}>
				<MoreInfoRow>
					<Typography>
						Made By
					</Typography>
					<Typography>
						Source Code
					</Typography>
				</MoreInfoRow>
				<MoreInfoRow>
					<Typography>
						License
					</Typography>
					<Typography>
						About
					</Typography>
				</MoreInfoRow>
			</MoreInfoBox>
		</Wrapper>
	)
}