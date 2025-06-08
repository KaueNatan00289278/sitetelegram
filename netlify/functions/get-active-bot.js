const Redis = require('ioredis'); // Importa a biblioteca ioredis

// Cria um cliente Redis usando o URL da variável de ambiente.
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

exports.handler = async function(event, context) {
    try {
        // Tenta obter a lista de bots ativos da chave 'active_telegram_bots' no Redis.
        // O Redis armazena strings, então esperamos que a lista seja um JSON stringificado.
        const activeBotsJson = await redis.get('active_telegram_bots');
        let activeBots = [];

        if (activeBotsJson) {
            // Se houver dados, faz o parse da string JSON para um array JavaScript.
            activeBots = JSON.parse(activeBotsJson);
        }

        // Se existirem bots ativos na lista
        if (activeBots && activeBots.length > 0) {
            return {
                statusCode: 200, // Status HTTP de sucesso
                // Define o cabeçalho CORS para permitir que seu site (do Netlify) chame a função.
                // Em produção, substitua '*' pelo domínio do seu site para maior segurança.
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ bot: activeBots[0] }), // Retorna o primeiro bot
            };
        } else {
            // Se não houver bots ativos ou a lista estiver vazia
            return {
                statusCode: 404, // Status HTTP de "Não Encontrado"
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ message: 'No active bots found.' }),
            };
        }
    } catch (error) {
        // Captura qualquer erro que ocorra durante a execução da função
        console.error("Erro ao buscar bot ativo do Redis:", error);
        return {
            statusCode: 500, // Status HTTP de "Erro Interno do Servidor"
            headers: { 'Access-Control-Allow-Origin': 'https://startling-narwhal-509b4d.netlify.app/' },
            body: JSON.stringify({ message: 'Internal server error.' }),
        };
    } finally {
        // É uma boa prática fechar a conexão Redis em funções serverless para liberar recursos.
        // Isso previne que a função "pendure" esperando a conexão fechar automaticamente.
        redis.quit();
    }
};