export default function getHumanReadableDate(rawdate: string) {
	const date = new Date(rawdate)
	return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}
