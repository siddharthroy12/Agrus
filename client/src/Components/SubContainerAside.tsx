import styled from 'styled-components'
import { Paper, Typography } from '@material-ui/core'
import { ReactNode } from 'react'

const Wrapper = styled.aside`
	width: 30rem;
	margin-left: 0.5rem;

	@media screen and (max-width: 850px) {
		display: none;
	}
`

const Sticky = styled.div`
	position: sticky;
	top: 80px;

	& > * {
		margin-bottom: 1rem;
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
			<Sticky>
			{ children }
			<Divider variant="outlined"/>
			<MoreInfoBox variant="outlined">
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
			</Sticky>
		</Wrapper>
	)
}