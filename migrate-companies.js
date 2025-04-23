// Script para migrar empresas do sistema antigo para o novo
// Execute com: node migrate-companies.js --year=2023 --toYear=2024 --month=01 --toMonth=12

const dotenv = require( 'dotenv' )
const readline = require( 'readline' )
const path = require( 'path' )
const { createStrapi } = require( '@strapi/strapi' )

// Carregar variáveis de ambiente
dotenv.config()

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

// Função para processar uma página de empresas
async function processPage ( options, page )
{
	try
	{
		const { year, toYear, month, toMonth, delayBetweenRequests } = options

		let savedNow = 0
		let savedBefore = 0
		let pagination
		let updatedNow = 0
		let errors = 0
		const ids = []

		const oldCrmDbUrl = process.env.OLD_CRM_DB_URL
		const oldCrmToken = process.env.OLD_CRM_TOKEN

		if ( !oldCrmDbUrl || !oldCrmToken || !strapi )
		{
			console.error( 'Erro: Variáveis de ambiente necessárias não estão definidas ou Strapi não foi inicializado.' )
			console.error( 'Certifique-se de que OLD_CRM_DB_URL e OLD_CRM_TOKEN estão definidas no arquivo .env.' )
			process.exit( 1 )
		}

		const fields = "fields=nome&fields=endereco&fields=numero&fields=complemento&fields=bairro&fields=cep&fields=cidade&fields=uf&fields=site&fields=pais&fields=porte&fields=simples&fields=ieStatus&fields=status&fields=email&fields=emailNfe&fields=CNPJ&fields=Ie&fields=fone&fields=celular&fields=CNAE&fields=codpais&fields=vendedor&fields=createdAt&fields=razao&fields=fantasia"
		const filters = `&filters[createdAt][$gt]=${ encodeURIComponent( `${ year }-${ month }-01T00:00:00Z` ) }&filters[createdAt][$lt]=${ encodeURIComponent( `${ toYear }-${ toMonth }-02T00:00:00Z` ) }`
		const companiesUrl = `${ oldCrmDbUrl }/empresas?${ fields + filters }&pagination[pageSize]=100&pagination[page]=${ page }`

		console.log( `\n[Página ${ page }] Buscando empresas criadas entre ${ year }-${ month } e ${ toYear }-${ toMonth }...` )

		const response = await fetch( companiesUrl, {
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

		console.log( `[Página ${ page }] Encontradas ${ responseData.data.length } empresas na página ${ pagination.page } de ${ pagination.pageCount }` )

		// Adicionar pequeno delay entre registros para evitar sobrecarga
		for ( const company of responseData.data )
		{
			const {
				nome,
				endereco,
				numero,
				complemento,
				bairro,
				cep,
				cidade,
				uf,
				site,
				pais,
				porte,
				simples,
				status,
				email,
				emailNfe,
				CNPJ,
				Ie,
				fone,
				celular,
				CNAE,
				codpais,
				vendedor,
				razao,
				fantasia
			} = company.attributes

			const sellerId = vendedor === "Antonio Carlos" ? "e83ie87u6uamq9tv70ia11ub" : (
				vendedor === "Virginia" ? "p0jvtwxotjrp4vgvj3rdh5gv" : (
					vendedor === "Claudia" ? "mpgx6xxontzgjm1vdtacl0a5" : "sw8fdp8y9nnubio1w231dow9"
				)
			)

			const data = {
				cnpj: CNPJ?.replace( /\D/g, '' ) || "0",
				displayName: nome || fantasia,
				corporateReason: razao,
				email: email,
				ie: Ie?.replace( /\D/g, '' ) || "0",
				country: pais,
				address: endereco,
				countryCode: Number( codpais?.replace( /\D/g, '' ) || 0 ),
				addressNumber: Number( numero?.replace( /\D/g, '' ) || 0 ),
				addressComplement: complemento,
				neighborhood: bairro,
				postalCode: cep?.replace( /\D/g, '' ) || "0",
				city: cidade,
				state: uf,
				website: site,
				nfeEmail: emailNfe,
				phone: fone?.replace( /\D/g, '' ) || celular?.replace( /\D/g, '' ) || "0",
				cnae: CNAE?.replace( /\D/g, '' ) || "0",
				companySize: porte,
				simplesNacional: !!simples,
				isActive: !!status,
				seller: sellerId,
				creditLimit: 15000,
				maximumPaymentTerm: 42,
				seasonality: 30,
				icmsTaxpayer: ""
			}

			if ( !CNPJ )
			{
				console.log( `[Página ${ page }] Pulando empresa sem CNPJ: ${ nome || fantasia }` )
				continue
			}

			// Adicionar um pequeno delay entre registros para evitar sobrecarga
			if ( delayBetweenRequests > 0 )
			{
				await new Promise( resolve => setTimeout( resolve, delayBetweenRequests ) )
			}

			try
			{
				// Verificar se a empresa já existe usando Document Service API do Strapi
				console.log( `[Página ${ page }] Verificando se empresa ${ CNPJ } já existe...` )

				const existingCompanies = await strapi.documents( 'api::company.company' ).findMany( {
					filters: {
						cnpj: { $eq: CNPJ?.replace( /\D/g, '' ) || "0" }
					},
					populate: '*'
				} )

				if ( existingCompanies && existingCompanies.length > 0 )
				{
					const existingCompany = existingCompanies[ 0 ]
					const id = existingCompany.id || existingCompany.documentId
					const corporateReason = existingCompany.corporateReason

					if ( !corporateReason )
					{
						process.stdout.write( `[Página ${ page }] Atualizando empresa ${ CNPJ } (ID: ${ id })... ` )

						// Atualizar empresa usando Document Service API do Strapi
						try
						{
							const updatedCompany = await strapi.documents( 'api::company.company' ).update( {
								documentId: id,
								data
							} )

							updatedNow++
							console.log( `✅ Atualizada com sucesso (ID: ${ updatedCompany.documentId || updatedCompany.id })` )
						} catch ( updateError )
						{
							errors++
							ids.push( id )
							console.log( `❌ Erro ao atualizar: ${ updateError.message }` )
						}
					} else
					{
						savedBefore++
						process.stdout.write( `[Página ${ page }] Empresa ${ CNPJ } já existe com dados completos... ⏩\n` )
					}
				} else
				{
					process.stdout.write( `[Página ${ page }] Criando nova empresa ${ CNPJ }... ` )

					// Criar empresa usando Document Service API do Strapi
					try
					{
						const createdCompany = await strapi.documents( 'api::company.company' ).create( {
							data
						} )

						savedNow++
						console.log( `✅ Criada com sucesso (ID: ${ createdCompany.documentId || createdCompany.id })` )
					} catch ( createError )
					{
						errors++
						console.log( `❌ Erro ao criar: ${ createError.message }` )
					}
				}
			} catch ( dbError )
			{
				console.error( `[Página ${ page }] Erro ao acessar o banco de dados: ${ dbError.message }` )
				errors++
			}
		}

		// Resumo da operação desta página
		console.log( `\n=== RESUMO DA PÁGINA ${ page } ===` )
		console.log( `✅ Novas empresas criadas: ${ savedNow }` )
		console.log( `🔄 Empresas atualizadas: ${ updatedNow }` )
		console.log( `⏩ Empresas já existentes ignoradas: ${ savedBefore }` )
		console.log( `❌ Erros: ${ errors }` )

		return {
			success: true,
			savedNow,
			savedBefore,
			updatedNow,
			errors,
			ids,
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
async function migrateCompanies ( options )
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
			savedNow: 0,
			savedBefore: 0,
			updatedNow: 0,
			errors: 0,
			pages: 0,
			startTime: new Date()
		}

		console.log( "===== INICIANDO MIGRAÇÃO AUTOMÁTICA DE EMPRESAS =====" )
		console.log( `Período: ${ options.year }-${ options.month } até ${ options.toYear }-${ options.toMonth }` )
		console.log( `Delay entre páginas: ${ options.delayBetweenPages }ms` )
		console.log( `Delay entre requisições: ${ options.delayBetweenRequests }ms` )
		console.log( "======================================================\n" )

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
			totalStats.savedNow += result.savedNow
			totalStats.savedBefore += result.savedBefore
			totalStats.updatedNow += result.updatedNow
			totalStats.errors += result.errors
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
		console.log( `✅ Total de novas empresas criadas: ${ totalStats.savedNow }` )
		console.log( `🔄 Total de empresas atualizadas: ${ totalStats.updatedNow }` )
		console.log( `⏩ Total de empresas já existentes ignoradas: ${ totalStats.savedBefore }` )
		console.log( `❌ Total de erros: ${ totalStats.errors }` )
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

// Executar o script se for o arquivo principal
if ( require.main === module )
{
	( async () =>
	{
		const options = parseArgs()

		console.log( "Iniciando migração AUTOMÁTICA de empresas com as seguintes opções:" )
		console.log( `- Período: ${ options.year }-${ options.month } até ${ options.toYear }-${ options.toMonth }` )
		console.log( `- Página inicial: ${ options.startPage }` )
		console.log( `- Delay entre páginas: ${ options.delayBetweenPages }ms` )
		console.log( `- Delay entre requisições: ${ options.delayBetweenRequests }ms` )
		console.log( "\nO processo irá migrar AUTOMATICAMENTE TODAS as páginas de empresas encontradas." )

		try
		{
			await migrateCompanies( options )
		} catch ( error )
		{
			console.error( 'Erro fatal durante a migração:', error )
			process.exit( 1 )
		}
	} )()
}

// Exportar a função principal para uso em outros módulos se necessário
module.exports = { migrateCompanies } 