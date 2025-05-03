interface ErrorDetails {
	[ key: string ]: any
}

export interface ResponseError {
	status: number
	name: string
	message: string
	details: ErrorDetails
}