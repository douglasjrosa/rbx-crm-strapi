import { Company } from "./company"
import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

// ClientAnalytic Interface for Strapi v5
export interface ClientAnalytic {
	id: number
	documentId: string
	analysisStartDate: string
	analysisEndDate: string
	totalRawMaterialsUsed: number
	rawMaterialsUsageShare?: number
	totalSales: number
	salesShare?: number
	totalContributionMargin?: number
	contributionMarginRate?: number
	contributionMarginShare?: number
	representativityRating?: number
	profitabilityRating?: number
	longestOrderInterval?: number
	shortestOrderInterval?: number
	recency?: number
	idealReturnDate?: string
	recurrence?: number
	frequencyRating?: number
	fidelityRating?: number
	qualitativeRating?: number
	relativeQualitativeRating?: number
	frameCode?: number
	company: Company
	createdAt?: string
	updatedAt?: string
}

export interface ResponseClientAnalytics {
	data: ClientAnalytic[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseClientAnalytic {
	data: ClientAnalytic
	meta?: ResponseMeta
	error?: ResponseError
} 