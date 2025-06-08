const axios = require('axios');
const Redis = require('ioredis'); // Importa a biblioteca ioredis

// Cria um cliente Redis usando o URL da variável de ambiente.
const redis = new Redis(process.env.UPSTASH_REDIS_URL);

// *** MUITO IMPORTANTE: Configure seus bots aqui! ***
// 'name': O nome do bot (será usado no link do Telegram, ex: t.me/SEUPREFIXO_1bot)
// 'tokenEnvVar': O NOME da variável de ambiente NO NETLIFY que contém o token REAL do bot.
const BOT_CONFIG = [
    { name: '1bot', tokenEnvVar: 'potates_2bot' },
    { name: '2bot', tokenEnvVar: 'potates_2bot' },
    // Adicione todos os seus bots aqui, cada um com seu nome e a variável de ambiente do token
    // Exemplo: { name: 'meu_bot_legal', tokenEnvVar: 'TELEGRAM_BOT_TOKEN_MEU_BOT_LEGAL' },
];

exports.handler = async function(event, context) {
    let activeBots = [];

    for (const bot of BOT_CONFIG) {
        // Obtém o token do bot da variável de ambiente do Netlify.
        const token = process.env[bot.tokenEnvVar];
        if (!token) {
            console.warn(`Token for ${bot.name} not found in environment variables.`);
            continue; // Pula para o próximo bot se o token não estiver configurado
        }

        try {
            // Tenta usar o método getMe da API do Telegram para verificar a saúde do bot.
            const response = await axios.get(`https://api.telegram.org/bot${token}/getMe`, { timeout: 5000 }); // 5 segundos de timeout
            if (response.data.ok && response.data.result.is_bot) {
                activeBots.push(bot.name); // Adiciona o bot à lista de ativos se ele responder OK
                console.log(`Bot ${bot.name} is active.`);
            } else {
                console.log(`Bot ${bot.name} is not OK or not a bot. Response: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            console.error(`Erro ao verificar bot ${bot.name}:`, error.message);
        }
    }

    try {
        // Salva a lista atualizada de bots ativos no Redis como uma string JSON.
        // A chave 'active_telegram_bots' é o nome da entrada no Redis.
        await redis.set('active_telegram_bots', JSON.stringify(activeBots));
        console.log("Active bots list updated in Redis:", activeBots);

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Bots checked and list updated successfully.', active_bots: activeBots }),
        };
    } catch (redisError) {
        console.error("Erro ao salvar bots ativos no Redis:", redisError);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'Error saving active bots list to Redis.' }),
        };
    } finally {
        // É importante fechar a conexão Redis em funções serverless para liberar recursos.
        redis.quit();
    }
};