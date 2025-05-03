---
description: Documentação completa sobre o Strapi Client e suas funcionalidades, incluindo instalação, configuração, métodos de acesso a dados e exemplos práticos baseados na documentação oficial do Strapi
globs: 
alwaysApply: false
---

# Strapi Client - Documentação Técnica [STRAPI-CLIENT]

## Diretrizes para Consulta da Documentação

Para consumo do Agente IA:

1. **Use este documento apenas quando forem necessários detalhes específicos de implementação do Strapi Client**
2. **Use referências diretas às seções**: Ao referenciar seções deste documento, use identificadores de seção (ex: [STRAPI-CLIENT-2.4]) para localizar informações específicas
3. **Evite escanear o documento inteiro**: Direcione apenas para as seções específicas que você precisa

## Índice de Referência Rápida

* [STRAPI-CLIENT-1] [Visão Geral do Strapi Client](mdc:#strapi-client-1-visão-geral-do-strapi-client)
* [STRAPI-CLIENT-2] [Instalação e Configuração](mdc:#strapi-client-2-instalação-e-configuração)
* [STRAPI-CLIENT-3] [Métodos Principais](mdc:#strapi-client-3-métodos-principais)
* [STRAPI-CLIENT-4] [Trabalhando com Collection Types](mdc:#strapi-client-4-trabalhando-com-collection-types)
* [STRAPI-CLIENT-5] [Trabalhando com Single Types](mdc:#strapi-client-5-trabalhando-com-single-types)
* [STRAPI-CLIENT-6] [Gerenciando Arquivos](mdc:#strapi-client-6-gerenciando-arquivos)
* [STRAPI-CLIENT-7] [Autenticação e Segurança](mdc:#strapi-client-7-autenticação-e-segurança)
* [STRAPI-CLIENT-8] [Exemplos de Uso Avançado](mdc:#strapi-client-8-exemplos-de-uso-avançado)

## [STRAPI-CLIENT-1] Visão Geral do Strapi Client

### [STRAPI-CLIENT-1.1] Conceito e Propósito

O Strapi Client é uma biblioteca oficial que simplifica a interação com o backend do Strapi:

* Fornece uma interface JavaScript/TypeScript para acessar a API REST do Strapi
* Facilita operações CRUD (Create, Read, Update, Delete) em conteúdos gerenciados pelo Strapi
* Substitui a necessidade de configurar manualmente requisições HTTP para a API do Strapi
* Oferece suporte a recursos avançados como internacionalização, draft/publish e uploads de mídia

### [STRAPI-CLIENT-1.2] Vantagens sobre Requisições HTTP Diretas

* **Interface consistente**: Métodos padronizados para diferentes tipos de conteúdo
* **Gerenciamento de autenticação**: Configuração simplificada de tokens de API
* **Tratamento de parâmetros**: Construção automática de queries complexas
* **Tratamento de erros**: Resposta de erro padronizada e mais informativa
* **Suporte a TypeScript**: Tipagem para maior segurança em tempo de desenvolvimento

## [STRAPI-CLIENT-2] Instalação e Configuração

### [STRAPI-CLIENT-2.1] Requisitos Prévios

Antes de utilizar o Strapi Client, certifique-se que:

* Um projeto Strapi foi criado e está em execução
* Você conhece a URL da API de Conteúdo da sua instância Strapi (ex: `http://localhost:1337/api`)
* O ambiente de desenvolvimento tem acesso a um gerenciador de pacotes (npm, yarn ou pnpm)

### [STRAPI-CLIENT-2.2] Instalação

Instale o Strapi Client como dependência utilizando seu gerenciador de pacotes preferido:

```bash
# Usando npm
npm install @strapi/client

# Usando yarn
yarn add @strapi/client

# Usando pnpm
pnpm add @strapi/client
```

### [STRAPI-CLIENT-2.3] Configuração Básica

Para começar a interagir com o backend Strapi, inicialize o cliente com a URL base da API:

```javascript
import {
    strapi
} from '@strapi/client';

const client = strapi({
    baseURL: 'http://localhost:1337/api'
});
```

Em ambientes de navegador, você pode incluir o Strapi Client usando uma tag `<script>` :

```html
<script src="https://cdn.jsdelivr.net/npm/@strapi/client"></script>

<script>
    const client = strapi.strapi({
        baseURL: 'http://localhost:1337/api'
    });
</script>
```

### [STRAPI-CLIENT-2.4] Opções de Configuração

O método de inicialização `strapi()` aceita um objeto de configuração com as seguintes opções:

| Parâmetro | Tipo   | Descrição                                  | Obrigatório |
|-----------|--------|-------------------------------------------|-------------|
| baseURL   | string | URL base da API do Strapi                 | Sim         |
| auth      | string | Token de API para autenticação            | Não         |
| prefix    | string | Prefixo personalizado para rotas da API   | Não         |
| axiosOptions | object | Opções passadas para a instância Axios | Não         |

Exemplo com opções adicionais:

```javascript
const client = strapi({
    baseURL: 'http://localhost:1337/api',
    auth: 'your-api-token-here',
    axiosOptions: {
        timeout: 5000,
        headers: {
            'Custom-Header': 'value'
        }
    }
});
```

## [STRAPI-CLIENT-3] Métodos Principais

### [STRAPI-CLIENT-3.1] Métodos de Alto Nível

O Strapi Client fornece os seguintes métodos e propriedades principais:

| Método/Propriedade | Descrição                                                                  |
|--------------------|----------------------------------------------------------------------------|
| fetch()            | Método utilitário para requisições API genéricas (similar ao fetch nativo) |
| collection()       | Gerencia recursos do tipo coleção (ex: posts de blog, produtos)            |
| single()           | Gerencia recursos do tipo único (ex: configurações de homepage)            |
| files              | Acesso à Biblioteca de Mídia para gerenciar arquivos                       |

### [STRAPI-CLIENT-3.2] Método Fetch Genérico

O método `fetch()` permite fazer requisições diretas à API, sendo sempre relativa à URL base fornecida durante a inicialização do cliente:

```javascript
// Fazer uma requisição GET para /api/articles
const result = await client.fetch('articles', {
    method: 'GET'
});

// Fazer uma requisição POST para /api/articles
const newArticle = await client.fetch('articles', {
    method: 'POST',
    data: {
        title: 'Novo Artigo',
        content: 'Conteúdo do artigo...'
    }
});
```

### [STRAPI-CLIENT-3.3] Parâmetros Comuns

Estes parâmetros são compatíveis com todos os métodos de busca:

| Parâmetro  | Descrição                                                        |
|------------|------------------------------------------------------------------|
| fields     | Especifica quais campos devem ser retornados na resposta         |
| filters    | Filtra os resultados baseado em condições                        |
| populate   | Inclui relações, campos de mídia, componentes ou zonas dinâmicas |
| sort       | Ordena os resultados por um ou mais campos                       |
| pagination | Controla a paginação dos resultados                              |
| locale     | Especifica a localização para conteúdo internacionalizado        |
| status     | Filtra por status (publicado/rascunho) quando Draft & Publish está habilitado |

## [STRAPI-CLIENT-4] Trabalhando com Collection Types

### [STRAPI-CLIENT-4.1] Introdução aos Collection Types

Collection Types no Strapi são entidades que podem ter múltiplas entradas (ex: blog com vários posts). O Strapi Client fornece o método `collection()` para interagir com esses recursos.

Exemplo de inicialização:

```javascript
const articles = client.collection('articles');
```

### [STRAPI-CLIENT-4.2] Métodos Disponíveis

| Método                               | Descrição                                                  |
|--------------------------------------|------------------------------------------------------------|
| find(queryParams?)                   | Busca múltiplos documentos com filtragem, ordenação ou paginação opcional |
| findOne(documentID, queryParams?)    | Recupera um documento único pelo seu ID                    |
| create(data, queryParams?)           | Cria um novo documento na coleção                          |
| update(documentID, data, queryParams?) | Atualiza um documento existente                          |
| delete(documentID, queryParams?)     | Exclui um documento existente                              |

### [STRAPI-CLIENT-4.3] Buscando Múltiplos Documentos

O método `find()` permite buscar uma lista de documentos com vários parâmetros de filtro:

```javascript
// Buscar todos os artigos em inglês ordenados por título
const allArticles = await articles.find({
    locale: 'en',
    sort: 'title',
});

// Buscar artigos com filtros
const filteredArticles = await articles.find({
    filters: {
        title: {
            $contains: 'Tutorial',
        },
        category: {
            name: {
                $eq: 'Technology',
            },
        },
    },
    pagination: {
        page: 1,
        pageSize: 10,
    },
});
```

### [STRAPI-CLIENT-4.4] Buscando um Documento Específico

O método `findOne()` recupera um único documento pelo seu ID:

```javascript
// Buscar um único artigo
const singleArticle = await articles.findOne('article-document-id');

// Buscar um artigo com suas relações populadas
const articleWithRelations = await articles.findOne('article-document-id', {
    populate: {
        author: {
            fields: ['name', 'email'],
        },
        categories: true,
    },
});
```

### [STRAPI-CLIENT-4.5] Criando Documentos

O método `create()` permite adicionar novos documentos à coleção:

```javascript
// Criar um novo artigo
const newArticle = await articles.create({
    title: 'Novo Artigo',
    content: 'Conteúdo do artigo...',
    categories: {
        connect: ['category-document-id-1', 'category-document-id-2'],
    },
});

// Criar um artigo em um locale específico
const frenchArticle = await articles.create({
    title: 'Nouvel Article',
    content: 'Contenu de l\'article...',
}, {
    locale: 'fr',
});
```

### [STRAPI-CLIENT-4.6] Atualizando Documentos

O método `update()` modifica documentos existentes:

```javascript
// Atualizar um artigo existente
const updatedArticle = await articles.update('article-document-id', {
    title: 'Título Atualizado',
    publishedAt: new Date().toISOString(),
});

// Atualizar um artigo em um locale específico
const updatedFrenchArticle = await articles.update(
    'article-document-id', {
        title: 'Titre Mis à Jour'
    }, {
        locale: 'fr'
    }
);
```

### [STRAPI-CLIENT-4.7] Excluindo Documentos

O método `delete()` remove documentos da coleção:

```javascript
// Excluir um artigo
await articles.delete('article-document-id');

// Excluir um artigo em um locale específico
await articles.delete('article-document-id', {
    locale: 'fr'
});
```

## [STRAPI-CLIENT-5] Trabalhando com Single Types

### [STRAPI-CLIENT-5.1] Introdução aos Single Types

Single Types no Strapi representam entradas únicas de conteúdo que existem apenas uma vez (ex: configurações da homepage ou configurações globais do site). O Strapi Client fornece o método `single()` para interagir com esses recursos.

Exemplo de inicialização:

```javascript
const homepage = client.single('homepage');
```

### [STRAPI-CLIENT-5.2] Métodos Disponíveis

| Método                       | Descrição                       |
|------------------------------|----------------------------------|
| find(queryParams?)           | Busca o documento                |
| update(data, queryParams?)   | Atualiza o documento             |
| delete(queryParams?)         | Remove o documento               |

### [STRAPI-CLIENT-5.3] Buscando um Single Type

O método `find()` recupera o conteúdo do single type:

```javascript
// Buscar o conteúdo padrão da homepage
const defaultHomepage = await homepage.find();

// Buscar a versão em espanhol da homepage
const spanishHomepage = await homepage.find({
    locale: 'es'
});

// Buscar a homepage com campos específicos e relações
const homepageWithRelations = await homepage.find({
    fields: ['title', 'subtitle'],
    populate: {
        seo: true,
        featuredImage: {
            fields: ['url', 'alternativeText'],
        },
    },
});
```

### [STRAPI-CLIENT-5.4] Atualizando um Single Type

O método `update()` modifica o conteúdo do single type:

```javascript
// Atualizar a homepage
const updatedHomepage = await homepage.update({
    title: 'Título Atualizado da Homepage',
    subtitle: 'Novo subtítulo para a homepage',
});

// Atualizar a versão em espanhol da homepage
const updatedSpanishHomepage = await homepage.update({
    title: 'Título Actualizado de la Página Principal',
    subtitle: 'Nuevo subtítulo para la página principal',
}, {
    locale: 'es'
});

// Atualizar a versão de rascunho da homepage
const draftHomepage = await homepage.update({
    title: 'Nova Homepage (Rascunho)'
}, {
    status: 'draft'
});
```

### [STRAPI-CLIENT-5.5] Excluindo um Single Type

O método `delete()` remove o conteúdo do single type:

```javascript
// Excluir o conteúdo da homepage
await homepage.delete();

// Excluir a versão em espanhol da homepage
await homepage.delete({
    locale: 'es'
});
```

## [STRAPI-CLIENT-6] Gerenciando Arquivos

### [STRAPI-CLIENT-6.1] Acesso à Biblioteca de Mídia

O Strapi Client fornece acesso à Biblioteca de Mídia através da propriedade `files` . Isso permite recuperar e gerenciar metadados de arquivos sem interagir diretamente com a API REST.

### [STRAPI-CLIENT-6.2] Métodos Disponíveis

| Método                   | Descrição                                                          |
|--------------------------|-------------------------------------------------------------------|
| find(params?)            | Recupera uma lista de metadados de arquivos baseado em parâmetros opcionais |
| findOne(fileId)          | Recupera os metadados de um único arquivo pelo seu ID             |
| update(fileId, fileInfo) | Atualiza metadados de um arquivo existente                        |
| delete(fileId)           | Exclui um arquivo pelo seu ID                                     |

### [STRAPI-CLIENT-6.3] Listando Arquivos

Para listar todos os arquivos ou filtrar por determinadas condições:

```javascript
// Listar todos os arquivos
const allFiles = await client.files.find();

// Filtrar arquivos por tipo e nome
const imageFiles = await client.files.find({
    filters: {
        mime: {
            $contains: 'image'
        }, // Apenas arquivos de imagem
        name: {
            $contains: 'avatar'
        }, // Apenas arquivos com 'avatar' no nome
    },
    sort: ['name:asc'], // Ordenar por nome em ordem ascendente
});

// Listar arquivos com paginação
const paginatedFiles = await client.files.find({
    pagination: {
        page: 1,
        pageSize: 10,
    },
});
```

### [STRAPI-CLIENT-6.4] Recuperando um Arquivo Específico

Para buscar os metadados de um arquivo específico:

```javascript
// Buscar metadados de arquivo por ID
const file = await client.files.findOne(1);
console.log(file.name); // Nome do arquivo
console.log(file.url); // URL do arquivo
console.log(file.mime); // Tipo MIME do arquivo
```

### [STRAPI-CLIENT-6.5] Atualizando Metadados de Arquivo

Para atualizar os metadados de um arquivo existente:

```javascript
// Atualizar metadados de arquivo
const updatedFile = await client.files.update(1, {
    name: 'Novo nome de arquivo',
    alternativeText: 'Texto alternativo descritivo para acessibilidade',
    caption: 'Uma legenda para o arquivo',
});
```

### [STRAPI-CLIENT-6.6] Excluindo Arquivos

Para excluir um arquivo da biblioteca de mídia:

```javascript
// Excluir um arquivo por ID
const deletedFile = await client.files.delete(1);
console.log('Arquivo excluído com sucesso');
console.log('ID do arquivo excluído:', deletedFile.id);
console.log('Nome do arquivo excluído:', deletedFile.name);
```

## [STRAPI-CLIENT-7] Autenticação e Segurança

### [STRAPI-CLIENT-7.1] Configuração de Autenticação

O Strapi Client suporta diferentes estratégias de autenticação para acessar recursos protegidos no backend Strapi:

#### Autenticação com Token API

```javascript
const client = strapi({
    baseURL: 'http://localhost:1337/api',
    auth: 'seu-token-api-aqui',
});
```

Isso permite que suas requisições incluam automaticamente as credenciais de autenticação necessárias.

### [STRAPI-CLIENT-7.2] Gerenciamento de Permissões

Ao utilizar o Strapi Client, é importante entender que as permissões são controladas no lado do servidor:

* As permissões são definidas no painel de administração do Strapi
* O Strapi Client apenas transmite as credenciais de autenticação
* Se um usuário não tiver permissão para um recurso, a API retornará um erro 403 Forbidden

### [STRAPI-CLIENT-7.3] Boas Práticas de Segurança

Ao implementar o Strapi Client em suas aplicações:

1. **Nunca exponha tokens API no código front-end**:
   * Utilize variáveis de ambiente para armazenar tokens
   * Em aplicações front-end, implemente um proxy no seu servidor

2. **Implemente validação de entrada**:
   * Valide dados antes de enviá-los para a API
   * Trate adequadamente os erros retornados pelo Strapi

3. **Use tokens com permissões mínimas**:
   * Crie tokens API com apenas as permissões necessárias
   * Limite o escopo dos tokens para APIs específicas quando possível

## [STRAPI-CLIENT-8] Exemplos de Uso Avançado

### [STRAPI-CLIENT-8.1] Trabalhando com Internacionalização (i18n)

Quando o plugin de internacionalização está habilitado, você pode acessar e gerenciar diferentes versões de localização:

```javascript
// Buscar artigos em diferentes localizações
const englishArticles = await articles.find({
    locale: 'en'
});
const frenchArticles = await articles.find({
    locale: 'fr'
});

// Buscar todas as localizações de um artigo específico
const allLocalesArticle = await articles.find({
    filters: {
        documentId: {
            $eq: 'article-document-id'
        },
    },
    locale: 'all',
});

// Criar um artigo em um locale específico
const spanishArticle = await articles.create({
    title: 'Nuevo Artículo',
    content: 'Contenido del artículo...',
}, {
    locale: 'es'
});

// Atualizar um artigo em múltiplos locales
await articles.update('article-document-id', {
    title: 'Updated Title'
}, {
    locale: 'en'
});
await articles.update('article-document-id', {
    title: 'Titre Mis à Jour'
}, {
    locale: 'fr'
});
```

### [STRAPI-CLIENT-8.2] Gerenciando Versões Draft e Published

Quando o recurso Draft & Publish está habilitado, você pode trabalhar com diferentes estados de publicação:

```javascript
// Buscar apenas artigos publicados (comportamento padrão)
const publishedArticles = await articles.find();

// Buscar apenas rascunhos
const draftArticles = await articles.find({
    status: 'draft'
});

// Criar um artigo como rascunho
const draftArticle = await articles.create({
    title: 'Artigo em Rascunho',
    content: 'Conteúdo do rascunho...',
}, {
    status: 'draft'
});

// Publicar um rascunho (definindo publishedAt para a data atual)
await articles.update('draft-article-id', {
    publishedAt: new Date().toISOString(),
});

// Converter um artigo publicado para rascunho
await articles.update('published-article-id', {
    publishedAt: null,
});
```

### [STRAPI-CLIENT-8.3] Gerenciando Relações

O Strapi Client permite gerenciar relações entre diferentes tipos de conteúdo:

```javascript
// Criar um artigo com categorias relacionadas
const articleWithCategories = await articles.create({
    title: 'Artigo com Categorias',
    content: 'Conteúdo do artigo...',
    categories: {
        connect: ['category-id-1', 'category-id-2'],
    },
});

// Atualizar relações existentes
await articles.update('article-id', {
    categories: {
        connect: ['new-category-id'], // Adicionar uma nova categoria
        disconnect: ['old-category-id'], // Remover uma categoria existente
    },
});

// Substituir todas as relações
await articles.update('article-id', {
    categories: {
        set: ['category-id-1', 'category-id-3'], // Substitui todas as categorias existentes
    },
});
```

### [STRAPI-CLIENT-8.4] Combinando Parâmetros Complexos

O Strapi Client permite combinar múltiplos parâmetros para consultas avançadas:

```javascript
// Busca avançada com múltiplos parâmetros
const result = await articles.find({
    filters: {
        $or: [{
                title: {
                    $contains: 'Strapi'
                }
            },
            {
                content: {
                    $contains: 'Strapi'
                }
            },
        ],
        publishedAt: {
            $gte: '2023-01-01',
        },
        category: {
            name: {
                $eq: 'Technology'
            },
        },
    },
    sort: ['publishedAt:desc'],
    populate: {
        author: {
            fields: ['name', 'avatar'],
        },
        categories: {
            fields: ['name', 'slug'],
        },
    },
    pagination: {
        page: 1,
        pageSize: 10,
    },
    locale: 'en',
});
```

### [STRAPI-CLIENT-8.5] Tratamento de Erros

Implemente tratamento adequado de erros ao utilizar o Strapi Client:

```javascript
try {
  const articles = client.collection('articles'); 
  const result = await articles.find(); 
  // Processar resultado
} catch (error) {
  if (error.response) {

    // O servidor respondeu com um status de erro
    console.error('Erro na resposta:', error.response.status, error.response.data);
    
    // Tratamento específico com base no código de erro
    if (error.response.status === 401) {
      // Problema de autenticação
      console.error('Falha na autenticação. Verifique seu token API.');
    } else if (error.response.status === 403) {
      // Problema de permissão
      console.error('Sem permissão para acessar este recurso.');
    } else if (error.response.status === 404) {
      // Recurso não encontrado
      console.error('O recurso solicitado não existe.');
    }

  } else if (error.request) {

    // A requisição foi feita mas não houve resposta
    console.error('Sem resposta do servidor:', error.request);

  } else {

    // Erro durante a configuração da requisição
    console.error('Erro ao configurar requisição:', error.message);

  }
}
```
