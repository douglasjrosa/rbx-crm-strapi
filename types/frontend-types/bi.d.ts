import { ResponseError } from "./error"
import { ResponseMeta } from "./meta"

// BI Interface for Strapi v5
export interface BI {
	id: number
	documentId: string
	periodStartDate: string
	periodEndDate: string
	periodType: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
	totalRawMaterialUsed: number
	totalSales: number
	totalContributionMargin?: number
	contributionMarginRate?: number
	totalOrderCount?: number
	averageOrderValue?: number
	topClientCount?: number
	topClientSalesPercentage?: number
	newClientCount?: number
	lostClientCount?: number
	frameDistribution?: any
	averageClientQualitativeRating?: number
	businessGrowthRate?: number
	bestSellingProducts?: any
	slowestMovingProducts?: any
	salesByRegion?: any
	salesByClientSegment?: any
	createdAt?: string
	updatedAt?: string
}

export interface ResponseBIs {
	data: BI[]
	meta?: ResponseMeta
	error?: ResponseError
}

export interface ResponseBI {
	data: BI
	meta?: ResponseMeta
	error?: ResponseError
} 