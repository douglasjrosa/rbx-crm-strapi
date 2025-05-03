import { Company } from "./company"
import { PaymentMethod } from "./payment-method"
import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

// Issuer Interface for Strapi v5
export interface Issuer {
	id: number
	documentId: string
	blingAccessToken?: string
	blingRefreshToken?: string
	blingClientId?: string
	blingClientSecret?: string
	blingExpiresIn?: number
	taxRate?: number
	payment_methods?: PaymentMethod[]
	isActive?: boolean
	company?: Company
	createdAt?: string
	updatedAt?: string
}

export interface ResponseIssuers {
	data: Issuer[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseIssuer {
	data: Issuer
	meta?: ResponseMeta
	error?: ResponseError
}