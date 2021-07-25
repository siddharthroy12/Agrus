import { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import Container from '../Components/Container'

import {
	Paper
} from '@material-ui/core'

import styled from 'styled-components'

export default function PostScreen() {
	const params:any = useParams()

	return (
		<>
			<Container>
				<Paper>

					{params.id}
				</Paper>
			</Container>
			
		</>
	)
}
