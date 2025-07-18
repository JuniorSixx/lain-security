# 🔐 Lain Security - Verificador de Senhas

> *"Present day, present time..."*

Uma ferramenta de segurança visualmente imersiva inspirada na estética cyberpunk de **Serial Experiments Lain**, que analisa a força de senhas e verifica vazamentos de dados.

![Lain Security](src/images/LainFundo.jpg)

## ✨ Funcionalidades

### 🔍 Análise de Força de Senhas
- **Avaliação em tempo real** da força da senha
- **Análise de comprimento** e diversidade de caracteres
- **Detecção de padrões fracos** (sequências, repetições)
- **Verificação de senhas comuns** e previsíveis
- **Cálculo de entropia** para medir complexidade

### 🛡️ Verificação de Vazamentos
- **Integração com Have I Been Pwned API**
- **Verificação anônima** (sua senha nunca é enviada)
- **Contagem de vazamentos** onde a senha apareceu
- **Feedback visual** sobre segurança

### 🔧 Gerador de Senhas Fortes
- **Geração automática** de senhas de alta entropia
- **Garantia de diversidade** de caracteres
- **Cópia para clipboard** com um clique
- **Análise automática** da senha gerada

### 🎨 Interface Cyberpunk
- **Design minimalista** inspirado em Serial Experiments Lain
- **Imagem de fundo** da Lain com blur suave
- **Animações fluidas** e efeitos de glow
- **Frases flutuantes** da série no background
- **Modo claro/escuro** com persistência

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** no seu navegador , ou acesse https://lain-security.vercel.app/
2. **Digite uma senha** no campo de entrada
3. **Clique em "ANALISAR SENHA"** ou pressione Enter
4. **Veja os resultados** em tempo real
5. **Use "GERAR SENHA FORTE"** para criar senhas seguras

## 📁 Estrutura do Projeto

```
lain-security/
├── index.html          # Página principal
├── style.css           # Estilos cyberpunk
├── script.js           # Lógica da aplicação
├── README.md           # Documentação
└── src/
    └── images/
        └── LainFundo.jpg  # Imagem de fundo da Lain
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos cyberpunk com animações
- **JavaScript ES6+** - Lógica da aplicação
- **Web Crypto API** - Hash SHA-1 para verificação de vazamentos
- **Have I Been Pwned API** - Verificação de vazamentos

## 🔒 Segurança

### Verificação de Vazamentos
- **Sua senha nunca é enviada** para servidores externos
- **Hash SHA-1** é calculado localmente
- **Apenas o prefixo do hash** é enviado para a API
- **Verificação anônima** e segura

### Análise Local
- **Todas as análises** são feitas no navegador
- **Nenhum dado** é armazenado ou transmitido
- **Privacidade total** garantida

## 🎯 Critérios de Avaliação

### Pontuação da Senha (0-6 pontos)
- **Comprimento**: 8+ caracteres (1 ponto), 12+ caracteres (2 pontos)
- **Letras minúsculas**: a-z (1 ponto)
- **Letras maiúsculas**: A-Z (1 ponto)
- **Números**: 0-9 (1 ponto)
- **Caracteres especiais**: !@#$%^&* (1 ponto)

### Penalizações
- **Senhas comuns**: -2 pontos
- **Padrões sequenciais**: -1 ponto
- **Caracteres repetidos**: -1 ponto
- **Palavras comuns**: -2 pontos

### Classificação
- **0-1 pontos**: FRACA 🔴
- **2-3 pontos**: MÉDIA 🟡
- **4-5 pontos**: FORTE 🟠
- **6+ pontos**: EXCELENTE 🟢

## 🎨 Personalização

### Modo Claro/Escuro
- **Botão de tema** no rodapé
- **Preferência salva** no localStorage
- **Transição suave** entre temas

### Frases Flutuantes
- **Frases da série** aparecem no background
- **Animações aleatórias** para atmosfera
- **Desabilitadas** em dispositivos móveis

## 📱 Responsividade

- **Design responsivo** para todos os dispositivos
- **Interface otimizada** para mobile
- **Animações adaptadas** para telas menores

## 🔧 Funcionalidades Extras

### Atalhos de Teclado
- **Enter**: Analisar senha
- **Toggle de visibilidade**: Clique no olho

### Feedback Visual
- **Barra de força** com cores dinâmicas
- **Animações de loading** durante verificações
- **Efeitos de hover** nos botões

## 🐛 Solução de Problemas

### Verificação de Vazamentos Falha
- **Verifique sua conexão** com a internet
- **A API pode estar temporariamente indisponível**
- **Tente novamente** em alguns minutos

### Imagem de Fundo Não Carrega
- **Verifique o caminho** `src/images/LainFundo.jpg`
- **Certifique-se** de que a imagem existe
- **Use um servidor local** se necessário

## 🤝 Contribuição

Sinta-se livre para contribuir com melhorias:

1. **Fork** o projeto
2. **Crie uma branch** para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra um Pull Request**

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---


**Lain Security** - Protegendo suas senhas com estilo cyberpunk desde 2025. 
