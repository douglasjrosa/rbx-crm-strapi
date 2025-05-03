import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

// Payment Method Interface for Strapi v5
export interface PaymentMethod {
	id: number
	documentId: string
	description?: string
	conditions?: string
	blingAccountCnpj?: number
	blingAccountName?: string
	blingPaymentMethodId?: number
	createdAt?: string
	updatedAt?: string
}

export interface ResponsePaymentMethods {
	data: PaymentMethod[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponsePaymentMethod {
	data: PaymentMethod
	meta?: ResponseMeta
	error?: ResponseError
}