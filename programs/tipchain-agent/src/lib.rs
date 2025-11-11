use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("HEWsDJuFvTpofnKG6xiVshokK9oKQfpwwEqurKHAFP8F");

#[program]
pub mod tipchain_agent {
    use super::*;

    /// Initialize the TipChain platform
    pub fn initialize(
        ctx: Context<Initialize>,
        platform_fee: u16,
        min_tip_amount: u64,
    ) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.authority = ctx.accounts.authority.key();
        platform_config.platform_fee = platform_fee;
        platform_config.fee_denominator = 10000;
        platform_config.min_tip_amount = min_tip_amount;
        platform_config.paused = false;
        platform_config.total_creators = 0;
        platform_config.total_tips = 0;
        platform_config.total_volume = 0;
        platform_config.top_tipper = Pubkey::default();
        platform_config.top_tip_amount = 0;

        msg!("TipChain Agent Economy initialized!");
        Ok(())
    }

    /// Register a new creator
    pub fn register_creator(
        ctx: Context<RegisterCreator>,
        basename: String,
        display_name: String,
        avatar_url: String,
    ) -> Result<()> {
        require!(basename.len() > 0 && basename.len() <= 20, ErrorCode::InvalidBasename);
        require!(display_name.len() > 0 && display_name.len() <= 50, ErrorCode::InvalidDisplayName);

        let creator = &mut ctx.accounts.creator;
        let platform_config = &mut ctx.accounts.platform_config;

        creator.authority = ctx.accounts.authority.key();
        creator.basename = basename.clone();
        creator.display_name = display_name.clone();
        creator.avatar_url = avatar_url;
        creator.total_tips_received = 0;
        creator.tip_count = 0;
        creator.last_tip_time = 0;
        creator.streak = 1;
        creator.reputation_score = 100;
        creator.agent_count = 0;
        creator.bump = ctx.bumps.creator;

        platform_config.total_creators += 1;

        emit!(CreatorRegistered {
            creator: ctx.accounts.authority.key(),
            basename,
            display_name,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Register an AI agent
    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        agent_name: String,
        agent_type: String,
    ) -> Result<()> {
        require!(agent_name.len() > 0 && agent_name.len() <= 30, ErrorCode::InvalidAgentName);

        let agent = &mut ctx.accounts.agent;
        agent.authority = ctx.accounts.authority.key();
        agent.agent_name = agent_name.clone();
        agent.agent_type = agent_type;
        agent.total_tips_sent = 0;
        agent.tip_count = 0;
        agent.reputation_score = 100;
        agent.is_active = true;
        agent.bump = ctx.bumps.agent;

        emit!(AgentRegistered {
            agent: ctx.accounts.authority.key(),
            agent_name,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Send a tip from agent/user to creator (x402 integrated)
    pub fn tip_creator(
        ctx: Context<TipCreator>,
        amount: u64,
        message: String,
        payment_proof: String, // x402 payment proof
    ) -> Result<()> {
        let platform_config = &ctx.accounts.platform_config;

        require!(!platform_config.paused, ErrorCode::ContractPaused);
        require!(amount >= platform_config.min_tip_amount, ErrorCode::AmountTooSmall);
        require!(message.len() <= 280, ErrorCode::MessageTooLong);

        let creator = &mut ctx.accounts.creator;
        let clock = Clock::get()?;

        // Calculate fees
        let fee = (amount as u128 * platform_config.platform_fee as u128
                  / platform_config.fee_denominator as u128) as u64;
        let amount_after_fee = amount - fee;

        // Transfer tokens to creator
        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.creator_token_account.to_account_info(),
            authority: ctx.accounts.tipper.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount_after_fee)?;

        // Transfer fee to platform
        if fee > 0 {
            let fee_cpi_accounts = Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.platform_token_account.to_account_info(),
                authority: ctx.accounts.tipper.to_account_info(),
            };
            let fee_cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                fee_cpi_accounts
            );
            token::transfer(fee_cpi_ctx, fee)?;
        }

        // Update streak logic
        let time_since_last_tip = clock.unix_timestamp - creator.last_tip_time;
        if time_since_last_tip < 86400 { // 24 hours
            creator.streak += 1;

            // Emit streak milestone events
            if creator.streak % 5 == 0 {
                emit!(StreakMilestone {
                    creator: creator.authority,
                    streak: creator.streak,
                    timestamp: clock.unix_timestamp,
                });
            }
        } else if time_since_last_tip >= 172800 { // 48 hours
            creator.streak = 1;
        }

        // Update creator stats
        creator.last_tip_time = clock.unix_timestamp;
        creator.total_tips_received += amount;
        creator.tip_count += 1;

        // Update platform stats
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.total_tips += 1;
        platform_config.total_volume += amount;

        // Check if this is top tip
        if amount > platform_config.top_tip_amount {
            platform_config.top_tipper = ctx.accounts.tipper.key();
            platform_config.top_tip_amount = amount;

            emit!(NewTopTipper {
                tipper: ctx.accounts.tipper.key(),
                amount,
                timestamp: clock.unix_timestamp,
            });
        }

        // Update agent stats if applicable
        if let Some(agent_account) = &mut ctx.accounts.agent {
            agent_account.total_tips_sent += amount;
            agent_account.tip_count += 1;
        }

        emit!(TipSent {
            from: ctx.accounts.tipper.key(),
            to: creator.authority,
            amount,
            amount_after_fee,
            fee,
            message,
            payment_proof,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    /// Update creator profile
    pub fn update_creator(
        ctx: Context<UpdateCreator>,
        display_name: Option<String>,
        avatar_url: Option<String>,
    ) -> Result<()> {
        let creator = &mut ctx.accounts.creator;

        if let Some(name) = display_name {
            require!(name.len() > 0 && name.len() <= 50, ErrorCode::InvalidDisplayName);
            creator.display_name = name;
        }

        if let Some(url) = avatar_url {
            creator.avatar_url = url;
        }

        Ok(())
    }

    /// Admin: Pause/unpause contract
    pub fn set_paused(ctx: Context<AdminAction>, paused: bool) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.paused = paused;

        msg!("Contract paused status: {}", paused);
        Ok(())
    }

    /// Admin: Update platform fee
    pub fn update_platform_fee(ctx: Context<AdminAction>, new_fee: u16) -> Result<()> {
        require!(new_fee <= 1000, ErrorCode::FeeTooHigh); // Max 10%

        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.platform_fee = new_fee;

        msg!("Platform fee updated to: {}", new_fee);
        Ok(())
    }

    /// Admin: Update minimum tip amount
    pub fn update_min_tip(ctx: Context<AdminAction>, new_min: u64) -> Result<()> {
        let platform_config = &mut ctx.accounts.platform_config;
        platform_config.min_tip_amount = new_min;

        msg!("Minimum tip updated to: {}", new_min);
        Ok(())
    }
}

// ============================================================================
// Accounts
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + PlatformConfig::INIT_SPACE,
        seeds = [b"platform_config"],
        bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(basename: String)]
pub struct RegisterCreator<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Creator::INIT_SPACE,
        seeds = [b"creator", basename.as_bytes()],
        bump
    )]
    pub creator: Account<'info, Creator>,

    #[account(mut)]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(agent_name: String)]
pub struct RegisterAgent<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Agent::INIT_SPACE,
        seeds = [b"agent", authority.key().as_ref()],
        bump
    )]
    pub agent: Account<'info, Agent>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TipCreator<'info> {
    #[account(mut)]
    pub creator: Account<'info, Creator>,

    #[account(mut)]
    pub platform_config: Account<'info, PlatformConfig>,

    #[account(mut)]
    pub agent: Option<Account<'info, Agent>>,

    #[account(mut)]
    pub tipper: Signer<'info>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub platform_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateCreator<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub creator: Account<'info, Creator>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub platform_config: Account<'info, PlatformConfig>,

    pub authority: Signer<'info>,
}

// ============================================================================
// State
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct PlatformConfig {
    pub authority: Pubkey,
    pub platform_fee: u16,
    pub fee_denominator: u16,
    pub min_tip_amount: u64,
    pub paused: bool,
    pub total_creators: u64,
    pub total_tips: u64,
    pub total_volume: u64,
    pub top_tipper: Pubkey,
    pub top_tip_amount: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Creator {
    pub authority: Pubkey,
    #[max_len(20)]
    pub basename: String,
    #[max_len(50)]
    pub display_name: String,
    #[max_len(200)]
    pub avatar_url: String,
    pub total_tips_received: u64,
    pub tip_count: u32,
    pub last_tip_time: i64,
    pub streak: u32,
    pub reputation_score: u32,
    pub agent_count: u32,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Agent {
    pub authority: Pubkey,
    #[max_len(30)]
    pub agent_name: String,
    #[max_len(20)]
    pub agent_type: String,
    pub total_tips_sent: u64,
    pub tip_count: u32,
    pub reputation_score: u32,
    pub is_active: bool,
    pub bump: u8,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct CreatorRegistered {
    pub creator: Pubkey,
    #[index]
    pub basename: String,
    pub display_name: String,
    pub timestamp: i64,
}

#[event]
pub struct AgentRegistered {
    pub agent: Pubkey,
    pub agent_name: String,
    pub timestamp: i64,
}

#[event]
pub struct TipSent {
    #[index]
    pub from: Pubkey,
    #[index]
    pub to: Pubkey,
    pub amount: u64,
    pub amount_after_fee: u64,
    pub fee: u64,
    pub message: String,
    pub payment_proof: String,
    pub timestamp: i64,
}

#[event]
pub struct NewTopTipper {
    pub tipper: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct StreakMilestone {
    pub creator: Pubkey,
    pub streak: u32,
    pub timestamp: i64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid basename")]
    InvalidBasename,
    #[msg("Invalid display name")]
    InvalidDisplayName,
    #[msg("Invalid agent name")]
    InvalidAgentName,
    #[msg("Contract is paused")]
    ContractPaused,
    #[msg("Amount is below minimum")]
    AmountTooSmall,
    #[msg("Message is too long")]
    MessageTooLong,
    #[msg("Fee is too high (max 10%)")]
    FeeTooHigh,
}
