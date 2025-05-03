import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

export interface Role {
	id: number
	name: string
	description?: string
	type?: string
}

// User Interface for Strapi v5
export interface User {
	id: number
	username: string
	email: string
	provider?: string
	resetPasswordToken?: string
	confirmationToken?: string
	confirmed?: boolean
	blocked?: boolean
	role?: Role
	jwt?: string
	phone?: string
	displayName?: string
	theme?: "light" | "dark"
	createdAt?: string
	updatedAt?: string
}

export interface ResponseUsers {
	data: User[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseUser {
	data: User
	meta?: ResponseMeta
	error?: ResponseError
}
