# Build Troubleshooting

Se você está tendo problemas com `anchor build`, siga este guia.

## Problema: "no such command: build-sbf"

Este erro acontece porque o `cargo-build-sbf` não está no PATH.

### Solução 1: Adicionar Solana ao PATH ⭐ (Recomendado)

```bash
# 1. Encontre onde o Solana está instalado
which solana

# 2. Se retornar algo como /home/user/.local/share/solana/install/active_release/bin/solana
# Adicione esse diretório ao PATH:

export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# 3. Verifique se agora tem acesso ao cargo-build-sbf
cargo-build-sbf --version

# 4. Se funcionar, adicione ao ~/.bashrc ou ~/.zshrc permanentemente:
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Solução 2: Reinstalar Solana

```bash
# Instalar Solana 1.18.17 (versão compatível com Anchor 0.32.1)
sh -c "$(curl -sSfL https://release.solana.com/v1.18.17/install)"

# Reiniciar terminal
# Verificar instalação
solana --version
cargo-build-sbf --version

# Build
anchor build
```

### Solução 3: Usar Docker 🐳

Se as soluções acima não funcionarem, use Docker:

```bash
# 1. Certifique-se que Docker está instalado
docker --version

# 2. Build usando Docker
chmod +x docker-build.sh
./docker-build.sh

# Ou manualmente:
docker build -f Dockerfile.build -t tipchain-build .
docker run --rm -v $(pwd)/target:/workspace/target tipchain-build
```

### Solução 4: Build manual com cargo

Se você tem Rust instalado, tente:

```bash
# Build manualmente
cd programs/tipchain-agent
cargo build-bpf
# ou
cargo build-sbf
```

## Problema: Versões incompatíveis

```
WARNING: `anchor-lang` version and CLI version don't match
```

**Solução:**
- Já corrigido! Anchor.toml tem `anchor_version = "0.32.1"`
- Verifique: `anchor --version` (deve ser 0.32.1)

Se for diferente:

```bash
# Instalar versão específica do Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.32.1
avm use 0.32.1
```

## Problema: Program ID inválido

```
error: String is the wrong size
```

**Solução:**
- Já corrigido! Program ID é `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

## Verificação Pós-Build

Depois do build bem-sucedido:

```bash
# Verificar arquivos gerados
ls -la target/deploy/

# Deve ter:
# - tipchain_agent.so (programa compilado)
# - tipchain_agent-keypair.json (keypair do programa)

# Pegar Program ID real
solana address -k target/deploy/tipchain_agent-keypair.json

# Atualizar Program ID nos arquivos:
# - programs/tipchain-agent/src/lib.rs (declare_id!)
# - Anchor.toml
# - sdk/src/index.ts
# - .env.example
# - app/.env.example

# Rebuild com Program ID correto
anchor build

# Deploy
anchor deploy --provider.cluster devnet
```

## Deploy para Devnet

```bash
# 1. Configurar Solana para devnet
solana config set --url devnet

# 2. Criar wallet se não tiver
solana-keygen new

# 3. Airdrop SOL para pagar deploy
solana airdrop 2

# 4. Deploy
anchor deploy --provider.cluster devnet

# 5. Inicializar plataforma
npx ts-node scripts/init-platform.ts
```

## Suporte

Se nenhuma solução funcionar:

1. Abra um issue no GitHub
2. Inclua:
   - Comando que você executou
   - Erro completo
   - `anchor --version`
   - `solana --version`
   - `cargo --version`
   - Sistema operacional

## Links Úteis

- [Anchor Docs](https://www.anchor-lang.com/)
- [Solana Docs](https://docs.solana.com/)
- [Install Solana](https://docs.solana.com/cli/install-solana-cli-tools)
- [Install Anchor](https://www.anchor-lang.com/docs/installation)
