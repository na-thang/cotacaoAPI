const axios = require('axios');
const readLine = require('readline');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function getUserInput(prompt){
    return new Promise((resolve) =>{
        rl.question(prompt, (answer) => {
            resolve(answer)
        });
    });
}

async function getExchangeRate(siglaMoeda){
    const apiUrl = `https://v6.exchangerate-api.com/v6/b4de066fe60760d738860d70/latest/${siglaMoeda}`;

    try {
        const response = await axios.get(apiUrl);

        const data = response.data;

        if (data.result === 'success'){
            const baseCode = data.base_code;
            const conversionRates = data.conversion_rates;
            const lastUpdateTimeUTC = data.time_last_update_utc;

            console.log(`Taxa de câmbio baseada em ${baseCode}`);
            
            for (const moeda in conversionRates){
                console.log(`1 ${baseCode} = ${conversionRates[moeda]} ${moeda}`);
            };

            console.log(`Última atualização: ${lastUpdateTimeUTC}`)

        } else {
            console.log('Erro ao obter as informações.');
        }

        askForAnotherSearch();

    } catch (error){
        console.error('Ocorreu um erro:', error.message);
        askForAnotherSearch();
    }
}

async function askForAnotherSearch() {
    const resposta = await getUserInput('Deseja realizar outra pesquisa? (s/n): ')
    if (resposta.toLowerCase() === 's') {
        main();
    } else {
        console.log('Encerrando o programa.');
        rl.close();
    }
    
}
async function main() {
    const siglaMoeda = await getUserInput('Digite a sigla da moeda desejada: ');
    
    getExchangeRate(siglaMoeda.toUpperCase());
}

main();