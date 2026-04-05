# Guia de Troubleshooting - watsonx.ai "Access Forbidden"

## Erro Atual

```
Error: Access forbidden. Please check your project permissions.
```

Este erro 403 indica que suas credenciais estão corretas, mas há um problema com as permissões do projeto ou configuração do watsonx.ai.

## Soluções Passo a Passo

### Solução 1: Verificar Permissões do Projeto

1. **Acesse seu projeto no watsonx.ai**:
   - Vá para https://dataplatform.cloud.ibm.com/wx/home
   - Clique em "Projects"
   - Abra seu projeto

2. **Verifique as permissões**:
   - Clique na aba "Manage" (no topo)
   - Vá para "Access control"
   - Certifique-se de que você tem a role de **"Admin"** ou **"Editor"**
   - Se você for apenas "Viewer", não poderá usar a API

3. **Se necessário, adicione permissões**:
   - Clique em "Add collaborators"
   - Adicione seu próprio email com role "Admin"

### Solução 2: Verificar Acesso ao Modelo Granite

1. **No seu projeto watsonx.ai**:
   - Vá para "Assets"
   - Clique em "New asset" → "Work with foundation models"
   - Procure por "Granite" nos modelos disponíveis

2. **Verifique se você tem acesso**:
   - Se não vir modelos Granite, você pode precisar:
     - Ativar o watsonx.ai na sua conta IBM Cloud
     - Verificar se sua região suporta Granite
     - Verificar se você tem quota disponível

### Solução 3: Criar um Novo Projeto com Configuração Correta

Às vezes é mais fácil criar um novo projeto do zero:

1. **No watsonx.ai**, clique em "Projects" → "New project"

2. **Selecione**: "Create an empty project"

3. **Preencha**:
   - Name: `AI Document Summarizer`
   - Description: `Project for document summarization`

4. **IMPORTANTE - Storage**:
   - Selecione ou crie um **Cloud Object Storage**
   - Isso é OBRIGATÓRIO para usar a API

5. **Após criar o projeto**:
   - Vá para "Manage" → "General"
   - Copie o novo **Project ID**
   - Atualize seu arquivo `server/.env` com o novo ID

### Solução 4: Verificar Configuração do .env

Verifique se seu arquivo `server/.env` está correto:

```env
# Certifique-se de não ter espaços ou aspas
WATSONX_API_KEY=sua_chave_sem_espacos_ou_aspas
WATSONX_PROJECT_ID=seu_project_id_sem_espacos_ou_aspas
WATSONX_URL=https://us-south.ml.cloud.ibm.com
PORT=5000
NODE_ENV=development
```

**Checklist**:
- ✅ Sem espaços antes/depois dos valores
- ✅ Sem aspas ao redor dos valores
- ✅ API Key completa (geralmente ~40 caracteres)
- ✅ Project ID no formato UUID (8-4-4-4-12 caracteres)

### Solução 5: Verificar Região do Serviço

O modelo Granite pode não estar disponível em todas as regiões. Tente diferentes URLs:

**Opção 1 - US South (padrão)**:
```env
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**Opção 2 - Dallas**:
```env
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**Opção 3 - Frankfurt**:
```env
WATSONX_URL=https://eu-de.ml.cloud.ibm.com
```

### Solução 6: Verificar Modelo Disponível

O modelo pode ter mudado de nome. Tente diferentes modelos no `server/.env`:

```env
# Opção 1 (padrão atual)
WATSONX_MODEL_ID=ibm/granite-3-8b-instruct

# Opção 2
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2

# Opção 3
WATSONX_MODEL_ID=ibm/granite-13b-instruct-v2
```

### Solução 7: Verificar Status da Conta IBM Cloud

1. **Acesse**: https://cloud.ibm.com/
2. **Verifique**:
   - Sua conta está ativa?
   - Você tem um plano ativo (Lite ou pago)?
   - Não há problemas de billing?

3. **Para plano Lite**:
   - Verifique se não excedeu a quota mensal
   - Vá para "Manage" → "Billing and usage"

### Solução 8: Testar Credenciais Manualmente

Vamos testar se suas credenciais funcionam:

1. **Crie um arquivo de teste** `test-watsonx.js` na pasta `server`:

```javascript
require('dotenv').config();
const axios = require('axios');

async function testWatsonX() {
  try {
    console.log('Testing watsonx.ai connection...');
    console.log('API Key:', process.env.WATSONX_API_KEY ? '✓ Set' : '✗ Missing');
    console.log('Project ID:', process.env.WATSONX_PROJECT_ID ? '✓ Set' : '✗ Missing');
    
    // Get IAM token
    console.log('\n1. Getting IAM token...');
    const tokenResponse = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      new URLSearchParams({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: process.env.WATSONX_API_KEY
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    console.log('✓ IAM token obtained successfully');
    
    // Test API call
    console.log('\n2. Testing watsonx.ai API...');
    const response = await axios.post(
      `${process.env.WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`,
      {
        model_id: 'ibm/granite-3-8b-instruct',
        input: 'Hello, this is a test.',
        parameters: {
          max_new_tokens: 50
        },
        project_id: process.env.WATSONX_PROJECT_ID
      },
      {
        headers: {
          'Authorization': `Bearer ${tokenResponse.data.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✓ API call successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testWatsonX();
```

2. **Execute o teste**:
```bash
cd server
node test-watsonx.js
```

3. **Analise o resultado**:
   - Se funcionar: o problema está no código da aplicação
   - Se falhar: o problema está nas credenciais/permissões

### Solução 9: Alternativa - Usar Modelo Diferente

Se o Granite não estiver disponível, você pode tentar outros modelos:

```env
# Modelo alternativo - Llama
WATSONX_MODEL_ID=meta-llama/llama-3-8b-instruct

# Ou Mistral
WATSONX_MODEL_ID=mistralai/mistral-7b-instruct-v0-2
```

### Solução 10: Verificar Logs Detalhados

Adicione mais logs para debug. Edite `server/src/services/watsonx.service.js`:

No método `callAPI`, adicione antes da linha 121:

```javascript
console.log('Debug Info:');
console.log('- Model ID:', this.config.modelId);
console.log('- Project ID:', this.config.projectId);
console.log('- Service URL:', this.config.serviceUrl);
console.log('- Token length:', token.length);
```

Reinicie o servidor e tente novamente. Os logs vão mostrar exatamente o que está sendo enviado.

## Checklist Final

Antes de pedir ajuda, verifique:

- [ ] API Key está correta e completa
- [ ] Project ID está correto (formato UUID)
- [ ] Você é Admin ou Editor do projeto
- [ ] O projeto tem Cloud Object Storage configurado
- [ ] Você está usando a região correta (us-south)
- [ ] O modelo Granite está disponível na sua conta
- [ ] Sua conta IBM Cloud está ativa
- [ ] Você não excedeu a quota (se usar plano Lite)
- [ ] O arquivo .env não tem espaços ou aspas extras
- [ ] Você reiniciou o servidor após mudar o .env

## Próximos Passos

Se nenhuma solução funcionar:

1. **Tente criar um projeto completamente novo** no watsonx.ai
2. **Use o script de teste** para verificar as credenciais
3. **Verifique se há atualizações** na documentação da IBM
4. **Considere usar um modelo alternativo** temporariamente

## Links Úteis

- **IBM Cloud Console**: https://cloud.ibm.com/
- **watsonx.ai**: https://dataplatform.cloud.ibm.com/wx/home
- **Documentação watsonx.ai**: https://www.ibm.com/docs/en/watsonx-as-a-service
- **Status IBM Cloud**: https://cloud.ibm.com/status
- **Suporte IBM**: https://www.ibm.com/mysupport

## Dica Importante

O erro 403 geralmente significa que:
1. ✅ Suas credenciais estão corretas (senão seria 401)
2. ❌ Mas você não tem permissão para usar o projeto/modelo

Foque em verificar as **permissões do projeto** e se o **Cloud Object Storage** está configurado!