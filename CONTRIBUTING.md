# Contributing to TipChain Agent Economy

We love your input! We want to make contributing to TipChain as easy and transparent as possible.

## Development Process

We use GitHub to host code, track issues, and accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Add tests if applicable
4. Ensure tests pass (`npm test`)
5. Update documentation
6. Submit a pull request

### Coding Standards

- **TypeScript**: Use strict mode, proper typing
- **Rust**: Follow rustfmt style
- **Commits**: Use conventional commits (feat:, fix:, docs:, etc.)
- **Code Review**: All PRs require at least one approval

## Project Structure

```
solana-x402/
├── programs/        # Solana smart contracts (Rust/Anchor)
├── sdk/            # TypeScript SDK
├── app/            # Next.js frontend
├── mcp-server/     # Model Context Protocol server
├── agents/         # AI agent implementations
├── scripts/        # Automation scripts
└── tests/          # Integration tests
```

## Setting Up Development Environment

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.17+
- Anchor CLI 0.29.0

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/solana-x402
cd solana-x402

# Run setup script
./scripts/setup.sh

# Or manual setup
npm install
cd app && npm install
cd ../sdk && npm install
cd ../mcp-server && npm install
```

### Building

```bash
# Build smart contract
anchor build

# Build SDK
cd sdk && npm run build

# Build MCP server
cd mcp-server && npm run build

# Build frontend
cd app && npm run build
```

### Testing

```bash
# Run Anchor tests
anchor test

# Run SDK tests (if implemented)
cd sdk && npm test

# Run frontend locally
cd app && npm run dev
```

## Smart Contract Development

### Adding New Instructions

1. Define instruction in `programs/tipchain-agent/src/lib.rs`
2. Add corresponding account struct
3. Update error codes if needed
4. Add tests in `tests/`
5. Update SDK in `sdk/src/index.ts`
6. Update MCP server if applicable

### Example

```rust
pub fn new_instruction(
    ctx: Context<NewInstruction>,
    param: u64,
) -> Result<()> {
    // Implementation
    Ok(())
}

#[derive(Accounts)]
pub struct NewInstruction<'info> {
    #[account(mut)]
    pub some_account: Account<'info, SomeAccount>,
    pub signer: Signer<'info>,
}
```

## SDK Development

### Adding New Methods

1. Add method to `TipChainSDK` class
2. Add proper TypeScript types
3. Add JSDoc documentation
4. Export types if needed
5. Update README with usage example

### Example

```typescript
/**
 * Get creator statistics
 * @param basename Creator basename
 * @returns Creator stats object
 */
async getCreatorStats(basename: string): Promise<CreatorStats> {
  const creator = await this.getCreator(basename);
  // Implementation
  return stats;
}
```

## Frontend Development

### Adding New Components

1. Create component in `app/src/components/`
2. Use TypeScript and proper typing
3. Follow Tailwind CSS conventions
4. Make it responsive
5. Add to appropriate page

### Component Template

```typescript
'use client';

interface MyComponentProps {
  data: string;
}

export default function MyComponent({ data }: MyComponentProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {data}
    </div>
  );
}
```

## MCP Server Development

### Adding New Tools

1. Define schema with Zod
2. Add tool to `getTools()` array
3. Implement handler method
4. Update README.md documentation

## AI Agent Development

### Creating New Agents

1. Create file in `agents/` directory
2. Extend base agent pattern
3. Implement discovery/tipping logic
4. Add configuration options
5. Document usage

## Testing Guidelines

### Unit Tests

- Test all public methods
- Mock external dependencies
- Use descriptive test names
- Aim for >80% coverage

### Integration Tests

- Test full user flows
- Test error cases
- Test edge cases
- Use devnet for testing

## Documentation

### Code Documentation

- Add JSDoc/rustdoc comments
- Explain complex logic
- Include usage examples
- Keep up to date

### README Updates

- Update README.md when adding features
- Keep examples current
- Update installation steps if changed

## Reporting Bugs

Report bugs via GitHub issues with:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages/logs

## Feature Requests

Submit feature requests via GitHub issues:

- Explain the use case
- Describe proposed solution
- Consider alternatives
- Discuss implementation

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open a GitHub issue
- Join our Discord: [discord.gg/tipchain](https://discord.gg/tipchain)
- Email: dev@tipchain.ai

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (when launched)

Thank you for contributing to TipChain! 🚀
