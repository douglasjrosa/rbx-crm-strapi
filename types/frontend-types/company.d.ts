import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"
import { User } from "./user"

// Company Interface for Strapi v5
export interface Company {
	id: number
	documentId: string
	isActive?: boolean
	creditLimit?: number
	maximumPaymentTerm?: number
	displayName: string
	cnpj: string
	corporateReason?: string
	ie?: number
	country?: string
	address?: string
	countryCode?: number
	addressNumber?: number
	addressComplement?: string
	neighborhood?: string
	postalCode?: number
	city?: string
	state?: string
	website?: string
	logoUrl?: string
	phone?: number
	icmsTaxpayer?: string
	cnae?: number
	companySize?: string
	simplesNacional?: boolean
	nfeEmail?: string
	email?: string
	seller?: User
	createdAt?: string
	updatedAt?: string
}

// Response interfaces for Strapi v5
export interface ResponseCompanies {
	data: Company[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseCompany {
	data: Company
	meta?: ResponseMeta
	error?: ResponseError
}