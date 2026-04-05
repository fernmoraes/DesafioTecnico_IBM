require('dotenv').config();
const axios = require('axios');

/**
 * Script de teste para verificar conexão com watsonx.ai
 * Execute: node test-watsonx.js
 */

async function testWatsonX() {
  console.log('='.repeat(60));
  console.log('🧪 Teste de Conexão watsonx.ai');
  console.log('='.repeat(60));
  
  // Verificar variáveis de ambiente
  console.log('\n📋 Verificando configuração...');
  console.log('API Key:', process.env.WATSONX_API_KEY ? '✓ Configurada' : '✗ Faltando');
  console.log('Project ID:', process.env.WATSONX_PROJECT_ID ? '✓ Configurado' : '✗ Faltando');
  console.log('URL:', process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com');
  
  if (!process.env.WATSONX_API_KEY || !process.env.WATSONX_PROJECT_ID) {
    console.error('\n❌ Erro: Variáveis de ambiente não configuradas!');
    console.error('Por favor, configure WATSONX_API_KEY e WATSONX_PROJECT_ID no arquivo .env');
    process.exit(1);
  }
  
  try {
    // Passo 1: Obter token IAM
    console.log('\n🔑 Passo 1: Obtendo token IAM...');
    const tokenResponse = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      new URLSearchParams({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: process.env.WATSONX_API_KEY
      }),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      }
    );
    
    console.log('✅ Token IAM obtido com sucesso!');
    console.log('   Token expira em:', tokenResponse.data.expires_in, 'segundos');
    
    const token = tokenResponse.data.access_token;
    
    // Passo 2: Testar chamada à API watsonx.ai
    console.log('\n🤖 Passo 2: Testando API watsonx.ai...');
    console.log('   Model ID: ibm/granite-3-8b-instruct');
    console.log('   Project ID:', process.env.WATSONX_PROJECT_ID);
    
    const serviceUrl = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
    
    const response = await axios.post(
      `${serviceUrl}/ml/v1/text/generation?version=2023-05-29`,
      {
        model_id: 'ibm/granite-3-8b-instruct',
        input: 'Summarize this text in one sentence: Artificial intelligence is transforming how we work and live.',
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7
        },
        project_id: process.env.WATSONX_PROJECT_ID
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('✅ Chamada à API bem-sucedida!');
    console.log('\n📝 Resposta da API:');
    console.log('   Status:', response.status);
    console.log('   Model:', response.data.model_id);
    console.log('   Generated text:', response.data.results[0].generated_text);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\nSua configuração está correta e funcionando.');
    console.log('Você pode iniciar a aplicação normalmente.');
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.log('❌ ERRO NO TESTE');
    console.log('='.repeat(60));
    
    if (error.response) {
      // Erro da API
      const status = error.response.status;
      const data = error.response.data;
      
      console.log('\n📊 Detalhes do erro:');
      console.log('   Status HTTP:', status);
      console.log('   Mensagem:', data.error?.message || data.message || 'Sem mensagem');
      
      console.log('\n💡 Possíveis soluções:');
      
      if (status === 401) {
        console.log('   ❌ API Key inválida');
        console.log('   → Verifique se a API Key está correta no arquivo .env');
        console.log('   → Gere uma nova API Key em: https://cloud.ibm.com/iam/apikeys');
      } else if (status === 403) {
        console.log('   ❌ Acesso negado ao projeto');
        console.log('   → Verifique se você tem permissão de Admin/Editor no projeto');
        console.log('   → Certifique-se de que o projeto tem Cloud Object Storage configurado');
        console.log('   → Verifique se o Project ID está correto');
        console.log('   → Tente criar um novo projeto em: https://dataplatform.cloud.ibm.com/wx/home');
      } else if (status === 404) {
        console.log('   ❌ Projeto ou modelo não encontrado');
        console.log('   → Verifique se o Project ID está correto');
        console.log('   → Verifique se o modelo Granite está disponível na sua região');
      } else if (status === 429) {
        console.log('   ❌ Limite de requisições excedido');
        console.log('   → Aguarde alguns minutos e tente novamente');
        console.log('   → Verifique sua quota em: https://cloud.ibm.com/');
      } else {
        console.log('   ❌ Erro desconhecido');
        console.log('   → Verifique o status da IBM Cloud: https://cloud.ibm.com/status');
        console.log('   → Consulte a documentação: https://www.ibm.com/docs/en/watsonx-as-a-service');
      }
      
      console.log('\n📄 Resposta completa:');
      console.log(JSON.stringify(data, null, 2));
      
    } else if (error.request) {
      console.log('\n❌ Sem resposta do servidor');
      console.log('   → Verifique sua conexão com a internet');
      console.log('   → Verifique se a URL está correta:', process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com');
      console.log('   → Tente novamente em alguns minutos');
    } else {
      console.log('\n❌ Erro ao configurar requisição');
      console.log('   Mensagem:', error.message);
    }
    
    console.log('\n📚 Para mais ajuda, consulte:');
    console.log('   → WATSONX_TROUBLESHOOTING.md');
    console.log('   → SETUP_GUIDE.md');
    
    process.exit(1);
  }
}

// Executar teste
testWatsonX();

// Made with Bob
