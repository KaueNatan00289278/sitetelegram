const faunadb = require('faunadb'); // Importa a biblioteca do FaunaDB
const q = faunadb.query; // Alias para facilitar o uso das queries do FaunaDB

// Cria um cliente FaunaDB. A chave secreta será lida de uma variável de ambiente do Netlify.
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });

// Este é o manipulador principal da função Netlify
exports.handler = async function(event, context) {
    try {
        // Tenta buscar o documento que contém a lista de bots ativos no FaunaDB.
        // O ID 'active_bots_list' é apenas um exemplo. Você vai criar este documento.
        const result = await client.query(
            q.Get(q.Ref(q.Collection('settings'), 'active_bots_list')) 
        );
        // Pega a lista de bots do campo 'bots' dentro dos dados do documento.
        const activeBots = result.data.bots;

        // Se existirem bots ativos na lista
        if (activeBots && activeBots.length > 0) {
            // Retorna o primeiro bot da lista para o frontend.
            // Aqui você pode adicionar lógica para escolher um bot diferente se quiser (ex: aleatório).
            return {
                statusCode: 200, // Status HTTP de sucesso
                // Define o cabeçalho CORS para permitir que seu site (do Netlify) chame a função.
                // Em produção, substitua '*' pelo domínio do seu site para maior segurança.
                headers: { 'Access-Control-Allow-Origin': '*' }, 
                body: JSON.stringify({ bot: activeBots[0] }), // Retorna o nome do bot em formato JSON
            };
        } else {
            // Se não houver bots ativos
            return {
                statusCode: 404, // Status HTTP de "Não Encontrado"
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'No active bots found.' }),
            };
        }
    } catch (error) {
        // Captura qualquer erro que ocorra durante a execução da função
        console.error("Erro ao buscar bot ativo:", error);
        return {
            statusCode: 500, // Status HTTP de "Erro Interno do Servidor"
            headers: { 'Access-Control-Allow-Origin': 'https://6844bba5e6d088475a73dc8f--startling-narwhal-509b4d.netlify.app' },
            body: JSON.stringify({ message: 'Internal server error.' }),
        };
    }
};