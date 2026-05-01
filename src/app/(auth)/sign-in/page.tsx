'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link'; // ameero ka anchor tag
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { signInSchema } from '@/schemas/signInSchema';



function SignInPage() {
  const router = useRouter();

  return (
    <div>page signin</div>
  )
}

export default SignInPage