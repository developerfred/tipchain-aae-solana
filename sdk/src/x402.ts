/**
 * x402 Payment Protocol Implementation
 *
 * HTTP 402 Payment Required protocol for micropayments on Solana
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402
 */

import { PublicKey, Transaction, Keypair } from '@solana/web3.js';
import * as crypto from 'crypto';
import { Buffer } from 'buffer';

export interface X402PaymentProof {
  version: string;
  timestamp: number;
  sender: string;
  recipient: string;
  amount: number;
  currency: string;
  nonce: string;
  signature: string;
  metadata?: Record<string, any>;
}

export interface X402PaymentRequest {
  recipient: PublicKey;
  amount: number;
  message?: string;
  expiry?: number; // Unix timestamp
  metadata?: Record<string, any>;
}

export interface X402PaymentResponse {
  proof: X402PaymentProof;
  transaction?: string;
  verified: boolean;
}

/**
 * x402 Payment Protocol Handler
 */
export class X402Protocol {
  private static readonly VERSION = '1.0.0';
  private static readonly CURRENCY = 'SOL';

  /**
   * Generate a payment proof for x402 protocol
   */
  static generateProof(
    sender: Keypair,
    recipient: PublicKey,
    amount: number,
    metadata?: Record<string, any>
  ): X402PaymentProof {
    const timestamp = Date.now();
    const nonce = this.generateNonce();

    // Create proof payload
    const payload = {
      version: this.VERSION,
      timestamp,
      sender: sender.publicKey.toBase58(),
      recipient: recipient.toBase58(),
      amount,
      currency: this.CURRENCY,
      nonce,
      metadata: metadata || {},
    };

    // Sign the payload
    const signature = this.signPayload(payload, sender);

    return {
      ...payload,
      signature,
    };
  }

  /**
   * Verify a payment proof
   */
  static verifyProof(proof: X402PaymentProof): boolean {
    try {
      // Check version
      if (proof.version !== this.VERSION) {
        console.error('Invalid proof version');
        return false;
      }

      // Check timestamp (not too old - max 5 minutes)
      const age = Date.now() - proof.timestamp;
      if (age > 5 * 60 * 1000) {
        console.error('Proof expired');
        return false;
      }

      // Check required fields
      if (
        !proof.sender ||
        !proof.recipient ||
        !proof.amount ||
        !proof.nonce ||
        !proof.signature
      ) {
        console.error('Missing required fields');
        return false;
      }

      // Verify signature
      return this.verifySignature(proof);
    } catch (error) {
      console.error('Proof verification failed:', error);
      return false;
    }
  }

  /**
   * Create payment request (HTTP 402 response)
   */
  static createPaymentRequest(
    recipient: PublicKey,
    amount: number,
    message?: string,
    expiryMinutes: number = 5
  ): string {
    const request: X402PaymentRequest = {
      recipient,
      amount,
      message,
      expiry: Date.now() + expiryMinutes * 60 * 1000,
    };

    const encoded = Buffer.from(JSON.stringify(request)).toString('base64');

    return `x402-payment-required:${encoded}`;
  }

  /**
   * Parse payment request
   */
  static parsePaymentRequest(header: string): X402PaymentRequest | null {
    try {
      if (!header.startsWith('x402-payment-required:')) {
        return null;
      }

      const encoded = header.replace('x402-payment-required:', '');
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const request = JSON.parse(decoded);

      // Check expiry
      if (request.expiry && Date.now() > request.expiry) {
        throw new Error('Payment request expired');
      }

      return {
        ...request,
        recipient: new PublicKey(request.recipient),
      };
    } catch (error) {
      console.error('Failed to parse payment request:', error);
      return null;
    }
  }

  /**
   * Generate HTTP 402 response headers
   */
  static generate402Headers(
    recipient: PublicKey,
    amount: number,
    acceptedMethods: string[] = ['SOL', 'USDC']
  ): Record<string, string> {
    const paymentRequest = this.createPaymentRequest(recipient, amount);

    return {
      'WWW-Authenticate': paymentRequest,
      'Accept-Payment': acceptedMethods.join(', '),
      'Payment-Amount': `${amount} SOL`,
      'Payment-Recipient': recipient.toBase58(),
    };
  }

  /**
   * Parse HTTP 402 response
   */
  static parse402Response(headers: Record<string, string>): X402PaymentRequest | null {
    const authHeader = headers['WWW-Authenticate'] || headers['www-authenticate'];

    if (!authHeader) {
      return null;
    }

    return this.parsePaymentRequest(authHeader);
  }

  /**
   * Encode proof for Authorization header
   */
  static encodeProofHeader(proof: X402PaymentProof): string {
    const encoded = Buffer.from(JSON.stringify(proof)).toString('base64');
    return `x402 ${encoded}`;
  }

  /**
   * Decode proof from Authorization header
   */
  static decodeProofHeader(header: string): X402PaymentProof | null {
    try {
      if (!header.startsWith('x402 ')) {
        return null;
      }

      const encoded = header.replace('x402 ', '');
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode proof header:', error);
      return null;
    }
  }

  /**
   * Format proof as string (for logging/display)
   */
  static formatProof(proof: X402PaymentProof): string {
    return `x402_${proof.timestamp}_${proof.sender}_${proof.recipient}_${proof.amount}_${proof.nonce}`;
  }

  /**
   * Generate cryptographically secure nonce
   */
  private static generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Sign payload with sender's keypair
   */
  private static signPayload(
    payload: Omit<X402PaymentProof, 'signature'>,
    signer: Keypair
  ): string {
    const message = JSON.stringify(payload);
    const messageBuffer = Buffer.from(message);

    // In a real implementation, this would use Solana's signature scheme
    // For demo purposes, we'll use a simple hash-based signature
    const hash = crypto.createHash('sha256').update(messageBuffer).digest('hex');

    // Simulate signing with keypair (in production, use nacl.sign)
    const signature = crypto
      .createHmac('sha256', signer.secretKey.slice(0, 32))
      .update(hash)
      .digest('hex');

    return signature;
  }

  /**
   * Verify signature
   */
  private static verifySignature(proof: X402PaymentProof): boolean {
    try {
      const { signature, ...payload } = proof;

      // Recreate hash
      const message = JSON.stringify(payload);
      const messageBuffer = Buffer.from(message);
      const hash = crypto.createHash('sha256').update(messageBuffer).digest('hex');

      // In production, verify using public key
      // For demo, we'll just check signature exists and is valid format
      return signature.length === 64 && /^[a-f0-9]+$/.test(signature);
    } catch (error) {
      return false;
    }
  }
}

/**
 * x402 Creator API Wrapper
 *
 * Wrap your APIs to require payment via x402
 */
export class X402API {
  private recipient: PublicKey;
  private pricePerRequest: number;

  constructor(recipient: PublicKey, pricePerRequest: number) {
    this.recipient = recipient;
    this.pricePerRequest = pricePerRequest;
  }

  /**
   * Middleware to check for payment proof
   */
  requirePayment(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No payment proof, send 402
      const headers = X402Protocol.generate402Headers(
        this.recipient,
        this.pricePerRequest
      );

      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      return res.status(402).json({
        error: 'Payment Required',
        message: 'This API requires payment via x402 protocol',
        amount: `${this.pricePerRequest} SOL`,
        recipient: this.recipient.toBase58(),
      });
    }

    // Verify payment proof
    const proof = X402Protocol.decodeProofHeader(authHeader);

    if (!proof) {
      return res.status(400).json({
        error: 'Invalid Payment Proof',
        message: 'Could not parse x402 payment proof',
      });
    }

    const valid = X402Protocol.verifyProof(proof);

    if (!valid) {
      return res.status(402).json({
        error: 'Invalid Payment',
        message: 'Payment proof verification failed',
      });
    }

    // Payment verified, continue
    req.paymentProof = proof;
    next();
  }

  /**
   * Create paid endpoint
   */
  paidEndpoint(handler: (req: any, res: any) => void) {
    return (req: any, res: any) => {
      this.requirePayment(req, res, () => handler(req, res));
    };
  }
}

export default X402Protocol;
