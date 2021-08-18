import styled from 'styled-components'
import { Paper, Typography, Link } from '@material-ui/core'
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
		cursor: pointer;
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
					<Link
						color="inherit"
						href="https://twitter.com/Siddharth_Roy12"
						rel="noopener"
						target="_blank"
					>
						Made By
					</Link>
					<Link
						href="https://github.com/siddharthroy12/Agrus"
						color="inherit"
						rel="noopener"
						target="_blank"
					>
						Source Code
					</Link>
				</MoreInfoRow>
				<MoreInfoRow>
					<Link
						href="https://raw.githubusercontent.com/siddharthroy12/Agrus/main/LICENSE.txt"
						color="inherit"
						rel="noopener"
						target="_blank"
					>
						License
					</Link>
					<Link
						color="inherit"
						rel="noopener"
						href="https://github.com/siddharthroy12/Agrus/blob/main/README.md"
						target="_blank"
					>
						About
					</Link>
				</MoreInfoRow>
				</MoreInfoBox>
			</Sticky>
		</Wrapper>
	)
}