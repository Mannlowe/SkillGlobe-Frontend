'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  phoneNumber?: string;
}

export function OtpModal({ isOpen, onClose, onVerify, phoneNumber }: OtpModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, timeLeft]);

  const handleVerify = () => {
    if (otp.filter(digit => digit !== '').length !== 5) {
      toast.error('Please enter a valid 5-digit OTP');
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    // Pass the OTP to parent component and let it handle the verification
    onVerify(otp.join(''));
    
    // Reset OTP input but don't close modal here - parent will close it
    setOtp(['', '', '', '', '']);
    
    // Don't set isVerifying to false here as the parent component
    // will handle the complete verification flow
  };

  const handleResendOtp = () => {
    setTimeLeft(30);
    setCanResend(false);
    toast.success('OTP resent successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Aadhaar Verification</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <p className="text-center text-sm text-gray-500">
            Please enter the 5-digit OTP sent to your registered mobile number
            {phoneNumber && <span className="font-medium"> {phoneNumber}</span>}
          </p>
          
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-xl"
                value={otp[index] || ''}
                onChange={(e) => {
                  const newValue = e.target.value.slice(-1);
                  const newOtp = [...otp];
                  newOtp[index] = newValue;
                  setOtp(newOtp);
                  
                  // Auto-focus next input
                  if (newValue && index < 4) {
                    const nextInput = document.querySelector(
                      `input[name=otp-${index + 1}]`
                    ) as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                }}
                onKeyDown={(e) => {
                  // Handle backspace to go to previous input
                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                    const prevInput = document.querySelector(
                      `input[name=otp-${index - 1}]`
                    ) as HTMLInputElement;
                    if (prevInput) prevInput.focus();
                  }
                }}
                name={`otp-${index}`}
              />
            ))}
          </div>
          
          <div className="text-sm text-gray-500">
            {canResend ? (
              <button 
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <span>Resend OTP in {timeLeft} seconds</span>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerify}
            disabled={otp.filter(digit => digit !== '').length !== 5 || isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
