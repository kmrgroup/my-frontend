import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Copy, Key, LucideWallet, RotateCw, Wallet, Send, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WalletService } from "@/lib/wallet/walletService";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

export function WalletManager() {
  const { toast } = useToast();
  const [step, setStep] = useState<number>(0);
  const [mnemonic, setMnemonic] = useState<string>("");
  const [verificationInput, setVerificationInput] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [seedVerified, setSeedVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants
  const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  // Progress calculation
  const getProgress = () => {
    if (step === 0) return 0;
    if (step === 1) return 25;
    if (step === 2) return 50;
    if (step === 2.5) return 75;
    if (step === 3) return 90;
    return 100;
  };

  // Add this at the start of the WalletManager component:
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        setIsLoading(true);
        const existingWallet = WalletService.getStoredWallet();
        if (existingWallet) {
          try {
            setWalletAddress(existingWallet.address);
            setPublicKey(existingWallet.publicKey);
            await fetchWalletBalance();
            setStep(4); // Move to wallet info view
            console.log("Restored existing wallet:", existingWallet.address);
          } catch (error) {
            console.error("Error restoring wallet state:", error);
            WalletService.clearWallet(); // Clear corrupted data
            setStep(0); // Reset to initial state
            toast({
              title: "Wallet Error",
              description: "There was an error loading your wallet. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Wallet initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWallet();
  }, []);

  // Step 1: User clicks "Create Wallet"
  const startWalletCreation = () => {
    setStep(1);
  };

  // Step 2: Generate 12-word seed phrase
  const generateWallet = async () => {
    try {
      setIsCreating(true);
      console.log("Starting wallet generation process...");

      // Clear any existing wallet data that might be corrupted
      WalletService.clearWallet();

      const result = await WalletService.generateWallet();

      if (!result || !result.mnemonic || !result.address || !result.publicKey) {
        throw new Error("Wallet generation returned incomplete data");
      }

      const { mnemonic, address, publicKey } = result;
      console.log("Wallet generated successfully with address:", address);

      setMnemonic(mnemonic);
      setWalletAddress(address);
      setPublicKey(publicKey);
      setStep(2);

      toast({
        title: "Wallet Generated",
        description: "Please safely store your seed phrase",
      });
    } catch (error) {
      console.error("Wallet generation UI error:", error);
      toast({
        title: "Wallet Creation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });

      // Reset state on error
      setMnemonic("");
      setWalletAddress("");
      setPublicKey("");
      setStep(0);
    } finally {
      setIsCreating(false);
    }
  };

  // Step 4: Verify seed phrase
  const verifySeedPhrase = () => {
    if (verificationInput.trim() === mnemonic.trim()) {
      setSeedVerified(true);
      setStep(3);
      toast({
        title: "Seed Phrase Verified",
        description: "Your seed phrase has been verified successfully.",
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "The seed phrase you entered doesn't match. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Step 5: Complete setup
  const completeWalletSetup = () => {
    if (!confirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that you've stored your seed phrase safely.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Complete wallet setup and store data
      const result = WalletService.completeWalletSetup(mnemonic);

      // Update UI state
      fetchWalletBalance();
      setStep(4);

      toast({
        title: "Wallet Ready",
        description: "Your wallet has been successfully created and secured.",
      });
    } catch (error) {
      console.error("Error completing wallet setup:", error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to complete wallet setup",
        variant: "destructive",
      });
      // Reset state on error
      setStep(0);
      setMnemonic("");
      setWalletAddress("");
      setConfirmed(false);
    }
  };

  const fetchWalletBalance = async () => {
    setWalletBalance("0.00");
  };

  const handleRecoverWallet = async () => {
    try {
      setIsRecovering(true);
      const { address } = await WalletService.recoverWallet(recoveryPhrase);
      toast({
        title: "Wallet Recovered",
        description: `Your wallet address: ${address}`,
      });
      setShowRecovery(false);
      setRecoveryPhrase("");
      setWalletAddress(address);
      fetchWalletBalance();
      setStep(4);
    } catch (error) {
      toast({
        title: "Recovery Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          transition={{ duration: 0.3 }}
        >
          {/* Progress bar */}
          {step > 0 && step < 4 && (
            <Progress value={getProgress()} className="mb-6" />
          )}

          {/* STEP 0: Initial screen */}
          {step === 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Create New Wallet</h2>
                <p className="text-muted-foreground">
                  Generate a new secure wallet for your NEURA coins
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={startWalletCreation}
                  className="w-full"
                >
                  <LucideWallet className="mr-2 h-4 w-4" />
                  Create Wallet
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">- or -</p>
                <Button
                  variant="outline"
                  onClick={() => setShowRecovery(true)}
                  className="w-full"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Recover Existing Wallet
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 1: Initial wallet creation - generating seed */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Generate Seed Phrase</h2>
                <p className="text-muted-foreground">
                  We'll create a unique 12-word seed phrase that will secure your wallet
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={getProgress()} className="w-full" />
                <p className="text-sm">
                  This seed phrase is the master key to your wallet. You'll need to save it securely.
                </p>
                <Button
                  onClick={generateWallet}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Generating..." : "Generate Seed Phrase"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Show seed phrase */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Your Seed Phrase</h2>
                <p className="text-muted-foreground">
                  Important: Write down these 12 words in order and keep them safe
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={getProgress()} className="w-full" />

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Never share your seed phrase!</AlertTitle>
                  <AlertDescription>
                    Anyone with these words can access your funds. Keep them offline and secure.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-3 gap-2 p-4 bg-muted rounded-md border">
                  {mnemonic.split(' ').map((word, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-1 text-muted-foreground">{index + 1}.</span>
                      <span className="font-mono">{word}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(mnemonic, "Seed phrase copied to clipboard")}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={() => setStep(2.5)}
                    className="flex-1"
                  >
                    I've Written It Down
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2.5: Verify seed phrase */}
          {step === 2.5 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Verify Seed Phrase</h2>
                <p className="text-muted-foreground">
                  Please enter your seed phrase to verify you've saved it correctly
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={getProgress()} className="w-full" />

                <Alert>
                  <AlertDescription>
                    This step ensures you've correctly noted down your seed phrase for wallet recovery.
                  </AlertDescription>
                </Alert>

                <Input
                  placeholder="Enter your 12-word seed phrase"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  className="font-mono"
                />

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={verifySeedPhrase}
                    className="flex-1"
                  >
                    Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Encrypt and Store */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Secure Your Wallet</h2>
                <p className="text-muted-foreground">
                  Your wallet has been created successfully
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={getProgress()} className="w-full" />

                <div className="p-4 bg-muted rounded-md border">
                  <p className="font-medium">Wallet Address:</p>
                  <p className="font-mono text-sm break-all">{walletAddress}</p>
                </div>

                <Alert>
                  <AlertTitle>Wallet Created</AlertTitle>
                  <AlertDescription>
                    Your wallet has been created and encrypted locally. Remember to keep your seed phrase in a safe place.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center space-x-2">
                  <Checkbox id="confirmed" checked={confirmed} onCheckedChange={(checked) => setConfirmed(checked as boolean)} />
                  <label
                    htmlFor="confirmed"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have stored my seed phrase in a secure location
                  </label>
                </div>

                <Button
                  onClick={completeWalletSetup}
                  disabled={!confirmed}
                  className="w-full"
                >
                  Complete Setup
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: Show Wallet Info */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Your NEURA Wallet</h2>
                <p className="text-muted-foreground">
                  Wallet ready for transactions
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-md border">
                    <p className="text-sm text-muted-foreground">Wallet Address</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono text-sm break-all">{walletAddress}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(walletAddress, "Address copied to clipboard")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-md border">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold">{walletBalance} NEURA</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Receive
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    WalletService.clearWallet();
                    setStep(0);
                    setMnemonic("");
                    setWalletAddress("");
                    setConfirmed(false);
                  }}
                  className="w-full text-destructive hover:text-destructive"
                >
                  Reset Wallet
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recovery Dialog */}
          {showRecovery && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Recover Wallet</h2>
                <p className="text-muted-foreground">
                  Enter your 12-word seed phrase to restore your wallet
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Make sure you're in a private and secure environment when entering your seed phrase.
                  </AlertDescription>
                </Alert>

                <Input
                  placeholder="Enter your 12-word seed phrase"
                  value={recoveryPhrase}
                  onChange={(e) => setRecoveryPhrase(e.target.value)}
                  className="font-mono"
                />

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRecovery(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRecoverWallet}
                    disabled={isRecovering || !recoveryPhrase}
                    className="flex-1"
                  >
                    {isRecovering ? "Recovering..." : "Recover Wallet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}