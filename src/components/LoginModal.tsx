'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// This component is deprecated. We're now using dedicated pages for authentication.
// Keeping the file for backward compatibility but it's no longer used in the application.

export default function LoginModal() {
  return null;
}
