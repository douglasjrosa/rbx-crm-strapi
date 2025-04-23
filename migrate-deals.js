// Script para migrar negócios e pedidos do sistema antigo para o novo
// Execute com: node migrate-deals.js --year=2023 --toYear=2024 --month=01 --toMonth=12

const dotenv = require( 'dotenv' )
const path = require( 'path' )
const { createStrapi } = require( '@strapi/strapi' )

// Carregar variáveis de ambiente
dotenv.config()

function isExpired ( datetime, daysToExpire )
{
	const specifiedDate = new Date( datetime )

	const currentDate = new Date()

	const differenceInMilliseconds = currentDate.getTime() - specifiedDate.getTime()

	const differenceInDays = differenceInMilliseconds / ( 1000 * 60 * 60 * 24 )

	return differenceInDays > daysToExpire
}

// Variável global para armazenar a instância do Strapi
let strapi

// Função para inicializar o Strapi
async function initStrapi ()
{
	console.log( 'Inicializando Strapi...' )

	try
	{
		strapi = await createStrapi( {
			appDir: process.cwd(),
			distDir: path.resolve( process.cwd(), 'dist' ),
		} ).load()

		console.log( 'Strapi inicializado com sucesso!' )
		return true
	} catch ( error )
	{
		console.error( 'Erro ao inicializar Strapi:', error.message )
		if ( error.stack ) console.error( error.stack )
		return false
	}
}

// Função para obter ID da empresa pelo CNPJ
async function getCompanyIdByCnpj ( cnpj )
{
	try
	{
		if ( !cnpj ) return null

		const companies = await strapi.documents( 'api::company.company' ).findMany( {
			filters: {
				cnpj: { $eq: cnpj.replace( /\D/g, '' ) || "0" }
			}
		} )

		return companies && companies.length > 0 ? companies[ 0 ].id || companies[ 0 ].documentId : null
	} catch ( error )
	{
		console.error( `Erro ao buscar empresa por CNPJ ${ cnpj }:`, error.message )
		return null
	}
}

// Função para obter ID do emissor através da empresa
async function getIssuerIdByCnpj ( cnpj )
{
	try
	{
		if ( !cnpj ) return null

		// Primeiro, obter o ID da empresa usando o CNPJ
		const companyId = await getCompanyIdByCnpj( cnpj )

		if ( !companyId )
		{
			console.log( `Empresa com CNPJ ${ cnpj } não encontrada, não é possível encontrar emissor` )
			return null
		}

		// Buscar o emissor relacionado à empresa
		const issuer = await strapi.documents( 'api::issuer.issuer' ).findFirst( {
			filters: {
				company: { $eq: companyId }
			}
		} )

		if ( issuer )
		{
			return issuer.id || issuer.documentId
		}

		console.log( `Nenhum emissor encontrado para a empresa ${ companyId }, retornando null` )
		return null
	} catch ( error )
	{
		console.error( `Erro ao buscar emissor para empresa:`, error.message )
		return null
	}
}

// Função para obter ID do usuário pelo email
async function getUserIdByEmail ( email )
{
	try
	{
		if ( !email ) return null

		const users = await strapi.documents( 'plugin::users-permissions.user' ).findMany( {
			filters: {
				email: { $eq: email }
			}
		} )

		return users && users.length > 0 ? users[ 0 ].id || users[ 0 ].documentId : null
	} catch ( error )
	{
		console.error( `Erro ao buscar usuário por email ${ email }:`, error.message )
		return null
	}
}

// Função para converter string para float
function parseToFloat ( value )
{
	if ( !value ) return 0
	if ( typeof value === 'number' ) return value
	return parseFloat( value.replace( /[^\d.,]/g, '' ).replace( ',', '.' ) ) || 0
}

// Função para processar uma página de negócios
async function processPage ( options, page )
{
	try
	{
		const { year, toYear, month, toMonth, delayBetweenRequests } = options

		let newDealSavedNow = 0
		let newOrderSavedNow = 0
		let newDealSavedBefore = 0
		let newOrderSavedBefore = 0
		let dealErrors = 0
		let orderErrors = 0
		let pagination

		const oldCrmDbUrl = process.env.OLD_CRM_DB_URL
		const oldCrmToken = process.env.OLD_CRM_TOKEN

		if ( !oldCrmDbUrl || !oldCrmToken || !strapi )
		{
			console.error( 'Erro: Variáveis de ambiente necessárias não estão definidas ou Strapi não foi inicializado.' )
			console.error( 'Certifique-se de que OLD_CRM_DB_URL e OLD_CRM_TOKEN estão definidas no arquivo .env.' )
			process.exit( 1 )
		}

		const fields = `fields[1]=Mperca&fields[2]=status&fields[3]=etapa&fields[4]=andamento&fields[5]=createdAt&fields[6]=updatedAt`
		const filters = `&filters[createdAt][$gt]=${ encodeURIComponent( `${ year }-${ month }-01T00:00:00Z` ) }&filters[createdAt][$lt]=${ encodeURIComponent( `${ toYear }-${ toMonth }-02T00:00:00Z` ) }`

		const populatePedidos = `&populate[pedidos][fields][0]=itens&populate[pedidos][fields][]=vencPedido&populate[pedidos][fields][]=frete&populate[pedidos][fields][]=descontoTotal&populate[pedidos][fields][]=custoAdicional&populate[pedidos][fields][]=totalGeral&populate[pedidos][fields][]=deliveryDate&populate[pedidos][fields][]=cliente_pedido&populate[pedidos][fields][]=obs&populate[pedidos][fields][]=valorFrete&populate[pedidos][fields][]=fornecedor`
		const populateEmpresa = `&populate[empresa][fields][0]=CNPJ`
		const populateVendedor = `&populate[vendedor][fields][0]=email`

		const paginationString = `&pagination[pageSize]=100&pagination[page]=${ page }`

		const businessesUrl = `${ oldCrmDbUrl }/businesses?${ fields + filters + populatePedidos + populateEmpresa + populateVendedor + paginationString }`

		console.log( `\n[Página ${ page }] Buscando negócios criados entre ${ year }-${ month } e ${ toYear }-${ toMonth }...` )

		const response = await fetch( businessesUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${ oldCrmToken }`,
			}
		} )

		if ( !response.ok )
		{
			console.error( `[Página ${ page }] Erro na API externa:`, response.status, response.statusText )
			return { success: false, error: `Erro ${ response.status }: ${ response.statusText }` }
		}

		const responseData = await response.json()
		pagination = responseData.meta.pagination

		console.log( `[Página ${ page }] Encontrados ${ responseData.data.length } negócios na página ${ pagination.page } de ${ pagination.pageCount }` )

		// Processar cada negócio da página
		for ( const deal of responseData.data )
		{
			if ( !deal || !deal.attributes )
			{
				console.error( `[Página ${ page }] Deal inválido:`, deal )
				dealErrors++
				continue
			}

			const {
				Mperca,
				empresa,
				vendedor,
				status,
				etapa,
				andamento,
				createdAt,
				updatedAt,
				pedidos
			} = deal.attributes

			// Adicionar um pequeno delay entre registros para evitar sobrecarga
			if ( delayBetweenRequests > 0 )
			{
				await new Promise( resolve => setTimeout( resolve, delayBetweenRequests ) )
			}

			try
			{
				// Buscar IDs relacionados
				const companyId = await getCompanyIdByCnpj( empresa?.data?.attributes?.CNPJ )
				const sellerId = await getUserIdByEmail( vendedor?.data?.attributes?.email )

				if ( !companyId )
				{
					console.log( `[Página ${ page }] Pulando negócio sem empresa válida: ID ${ deal.id }` )
					dealErrors++
					continue
				}

				const etapas = [ null, null, "Send proposal", "Follow up", "Negotiation", "Negotiation" ]
				const dealIsExpired = isExpired( updatedAt, 30 )
				const stage = etapa < 6 && !dealIsExpired ? etapas[ etapa ] : ( andamento === 5 ? "Won" : "Lost" )
				const finishedAt = stage === "Won" || stage === "Lost" ? updatedAt : null

				// Verificar se o negócio já existe
				console.log( `[Página ${ page }] Verificando se negócio ID ${ deal.id } já existe...` )

				const existingDeals = await strapi.documents( 'api::deal.deal' ).findMany( {
					filters: {
						migrationId: { $eq: String( deal.id ) }
					}
				} )

				let dealId = null

				if ( existingDeals && existingDeals.length > 0 )
				{
					// Negócio já existe
					dealId = existingDeals[ 0 ].id || existingDeals[ 0 ].documentId
					newDealSavedBefore++
					process.stdout.write( `[Página ${ page }] Negócio ID ${ deal.id } já existe... ⏩\n` )
				} else
				{
					// Criar novo negócio
					process.stdout.write( `[Página ${ page }] Criando novo negócio ID ${ deal.id }... ` )

					const newDealData = {
						reasonForLoss: String( Mperca || '' ),
						company: companyId,
						seller: sellerId,
						isActive: !!status,
						stage,
						startedAt: createdAt,
						followUpAt: null,
						negotiationAt: null,
						finishedAt,
						migrationId: String( deal.id )
					}

					try
					{
						const createdDeal = await strapi.documents( 'api::deal.deal' ).create( {
							data: newDealData
						} )

						dealId = createdDeal.id || createdDeal.documentId
						newDealSavedNow++
						console.log( `✅ Criado com sucesso (ID: ${ dealId })` )
					} catch ( createError )
					{
						dealErrors++
						console.log( `❌ Erro ao criar: ${ createError.message }` )
						continue
					}
				}

				// Processar pedidos associados ao negócio
				if ( pedidos && pedidos.data && pedidos.data.length > 0 )
				{
					for ( const pedido of pedidos.data )
					{
						if ( !pedido || !pedido.attributes )
						{
							console.error( `[Página ${ page }] Pedido inválido para negócio ${ deal.id }` )
							orderErrors++
							continue
						}

						const {
							vencPedido,
							frete,
							descontoTotal,
							custoAdicional,
							totalGeral,
							deliveryDate,
							cliente_pedido,
							obs,
							valorFrete,
							fornecedor,
							itens
						} = pedido.attributes

						// Verificar se o pedido já existe
						const existingOrders = await strapi.documents( 'api::order.order' ).findMany( {
							filters: {
								migrationId: { $eq: String( pedido.id ) }
							}
						} )

						if ( existingOrders && existingOrders.length > 0 )
						{
							newOrderSavedBefore++
							process.stdout.write( `[Página ${ page }] Pedido ID ${ pedido.id } já existe... ⏩\n` )
							continue
						}

						// Mapear itens do pedido
						let orderItems = []
						if ( itens && Array.isArray( itens ) )
						{
							orderItems = itens.map( item =>
							{
								const { codg, prodId, nomeProd, Qtd, mont, expo, vFinal, total } = item
								return {
									productCode: codg || prodId,
									description: nomeProd,
									qty: parseToFloat( Qtd ),
									mounted: mont,
									export: expo,
									price: parseToFloat( vFinal ),
									subtotal: parseToFloat( total )
								}
							} )
						}

						// Criar novo pedido
						process.stdout.write( `[Página ${ page }] Criando novo pedido ID ${ pedido.id }... ` )

						const issuerId = await getIssuerIdByCnpj( fornecedor )

						const newOrderData = {
							deal: dealId,
							seller: sellerId,
							deliverForecast: deliveryDate || vencPedido,
							freightType: frete,
							orderDiscount: parseToFloat( descontoTotal ),
							extraCosts: parseToFloat( custoAdicional ),
							orderSubtotalValue: parseToFloat( totalGeral ) - parseToFloat( custoAdicional ) + parseToFloat( descontoTotal ),
							orderTotalValue: parseToFloat( totalGeral ),
							clientOrderCode: cliente_pedido,
							observations: obs,
							company: companyId,
							issuer: issuerId,
							freightValue: parseToFloat( valorFrete ),
							items: orderItems,
							isActive: true,
							migrationId: String( pedido.id )
						}

						try
						{
							const createdOrder = await strapi.documents( 'api::order.order' ).create( {
								data: newOrderData
							} )

							newOrderSavedNow++
							console.log( `✅ Criado com sucesso (ID: ${ createdOrder.id || createdOrder.documentId })` )
						} catch ( createOrderError )
						{
							orderErrors++
							console.log( `❌ Erro ao criar: ${ createOrderError.message }` )
						}
					}
				} else
				{
					console.log( `[Página ${ page }] Negócio ID ${ deal.id } não tem pedidos associados` )
				}

			} catch ( dbError )
			{
				console.error( `[Página ${ page }] Erro ao acessar o banco de dados: ${ dbError.message }` )
				dealErrors++
			}
		}

		// Resumo da operação desta página
		console.log( `\n=== RESUMO DA PÁGINA ${ page } ===` )
		console.log( `✅ Novos negócios criados: ${ newDealSavedNow }` )
		console.log( `✅ Novos pedidos criados: ${ newOrderSavedNow }` )
		console.log( `⏩ Negócios já existentes ignorados: ${ newDealSavedBefore }` )
		console.log( `⏩ Pedidos já existentes ignorados: ${ newOrderSavedBefore }` )
		console.log( `❌ Erros em negócios: ${ dealErrors }` )
		console.log( `❌ Erros em pedidos: ${ orderErrors }` )

		return {
			success: true,
			newDealSavedNow,
			newOrderSavedNow,
			newDealSavedBefore,
			newOrderSavedBefore,
			dealErrors,
			orderErrors,
			pagination
		}
	} catch ( error )
	{
		console.error( `[Página ${ page }] Erro na migração:`, error.message )
		console.error( error.stack )
		return { success: false, error: error.message }
	}
}

// Função principal para migrar todas as páginas
async function migrateDeals ( options )
{
	try
	{
		// Inicializar Strapi apenas uma vez
		const strapiInitialized = await initStrapi()
		if ( !strapiInitialized )
		{
			console.error( 'Não foi possível inicializar o Strapi. Abortando migração.' )
			return { success: false }
		}

		let currentPage = options.startPage || 1
		let hasMorePages = true
		let totalPages = 0

		let totalStats = {
			newDealSavedNow: 0,
			newOrderSavedNow: 0,
			newDealSavedBefore: 0,
			newOrderSavedBefore: 0,
			dealErrors: 0,
			orderErrors: 0,
			pages: 0,
			startTime: new Date()
		}

		console.log( "===== INICIANDO MIGRAÇÃO AUTOMÁTICA DE NEGÓCIOS E PEDIDOS =====" )
		console.log( `Período: ${ options.year }-${ options.month } até ${ options.toYear }-${ options.toMonth }` )
		console.log( `Delay entre páginas: ${ options.delayBetweenPages }ms` )
		console.log( `Delay entre requisições: ${ options.delayBetweenRequests }ms` )
		console.log( "=============================================================\n" )

		// Loop para processar todas as páginas
		while ( hasMorePages )
		{
			// Processar a página atual
			const result = await processPage( options, currentPage )

			if ( !result.success )
			{
				console.error( `Erro ao processar a página ${ currentPage }:`, result.error )
				break
			}

			// Atualizar estatísticas totais
			totalStats.newDealSavedNow += result.newDealSavedNow
			totalStats.newOrderSavedNow += result.newOrderSavedNow
			totalStats.newDealSavedBefore += result.newDealSavedBefore
			totalStats.newOrderSavedBefore += result.newOrderSavedBefore
			totalStats.dealErrors += result.dealErrors
			totalStats.orderErrors += result.orderErrors
			totalStats.pages++

			// Verificar se há mais páginas
			if ( result.pagination.page < result.pagination.pageCount )
			{
				currentPage++
				totalPages = result.pagination.pageCount
				console.log( `\nAguardando ${ options.delayBetweenPages }ms antes de processar a próxima página...` )
				await new Promise( resolve => setTimeout( resolve, options.delayBetweenPages ) )
			} else
			{
				hasMorePages = false
			}
		}

		// Tempo total
		const endTime = new Date()
		const totalTime = ( endTime - totalStats.startTime ) / 1000 // em segundos

		// Exibir resumo geral
		console.log( "\n\n========== RESUMO GERAL DA MIGRAÇÃO ==========" )
		console.log( `Total de páginas processadas: ${ totalStats.pages } de ${ totalPages || totalStats.pages }` )
		console.log( `✅ Total de novos negócios criados: ${ totalStats.newDealSavedNow }` )
		console.log( `✅ Total de novos pedidos criados: ${ totalStats.newOrderSavedNow }` )
		console.log( `⏩ Total de negócios já existentes ignorados: ${ totalStats.newDealSavedBefore }` )
		console.log( `⏩ Total de pedidos já existentes ignorados: ${ totalStats.newOrderSavedBefore }` )
		console.log( `❌ Total de erros em negócios: ${ totalStats.dealErrors }` )
		console.log( `❌ Total de erros em pedidos: ${ totalStats.orderErrors }` )
		console.log( `⏱️ Tempo total: ${ totalTime.toFixed( 2 ) } segundos` )
		console.log( "===============================================" )

		// Encerrar o Strapi ao finalizar
		if ( strapi )
		{
			console.log( '\nEncerrando o Strapi...' )
			await strapi.destroy()
			console.log( 'Strapi encerrado com sucesso!' )
		}

		return totalStats
	} catch ( error )
	{
		console.error( 'Erro geral na migração:', error.message )
		console.error( error.stack )

		// Encerrar o Strapi em caso de erro também
		if ( strapi )
		{
			try
			{
				await strapi.destroy()
				console.log( 'Strapi encerrado após erro.' )
			} catch ( destroyError )
			{
				console.error( 'Erro ao encerrar Strapi:', destroyError.message )
			}
		}

		process.exit( 1 )
	}
}

// Função para analisar argumentos da linha de comando
function parseArgs ()
{
	const args = process.argv.slice( 2 )
	const options = {
		year: new Date().getFullYear().toString(),
		toYear: new Date().getFullYear().toString(),
		month: '01',
		toMonth: '12',
		startPage: 1,
		delayBetweenPages: 500, // 500ms entre páginas
		delayBetweenRequests: 500  // 500ms entre requisições individuais
	}

	args.forEach( arg =>
	{
		const match = arg.match( /^--([a-zA-Z]+)=(.+)$/ )
		if ( match )
		{
			const [ , key, value ] = match

			// Converter valores numéricos
			if ( [ 'startPage', 'delayBetweenPages', 'delayBetweenRequests' ].includes( key ) )
			{
				options[ key ] = parseInt( value, 10 )
			} else
			{
				options[ key ] = value
			}
		}
	} )

	return options
}

// Criar função de helper isExpired caso não exista
if ( typeof isExpired !== 'function' )
{
	function isExpired ( date, days )
	{
		if ( !date ) return true
		const updatedDate = new Date( date )
		const now = new Date()
		const diffTime = Math.abs( now - updatedDate )
		const diffDays = Math.ceil( diffTime / ( 1000 * 60 * 60 * 24 ) )
		return diffDays > days
	}
}

// Executar o script se for o arquivo principal
if ( require.main === module )
{
	( async () =>
	{
		const options = parseArgs()

		console.log( "Iniciando migração AUTOMÁTICA de negócios e pedidos com as seguintes opções:" )
		console.log( `- Período: ${ options.year }-${ options.month } até ${ options.toYear }-${ options.toMonth }` )
		console.log( `- Página inicial: ${ options.startPage }` )
		console.log( `- Delay entre páginas: ${ options.delayBetweenPages }ms` )
		console.log( `- Delay entre requisições: ${ options.delayBetweenRequests }ms` )
		console.log( "\nO processo irá migrar AUTOMATICAMENTE TODAS as páginas de negócios encontradas." )

		try
		{
			await migrateDeals( options )
		} catch ( error )
		{
			console.error( 'Erro fatal durante a migração:', error )
			process.exit( 1 )
		}
	} )()
}

// Exportar a função principal para uso em outros módulos se necessário
module.exports = { migrateDeals }