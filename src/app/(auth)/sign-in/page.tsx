'use client'; 
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';
import { errorToJSON } from 'next/dist/server/render';


function page() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  //zod ki implementation
  const form = useForm<z.infer<typeof signInSchema>>({ //z.infer chudap hai, optional
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  });


  const onSubmit = async(data: z.infer<typeof signInSchema>)=>{
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect:false,
        emailOrUsername: data.identifier,
        password: data.password
      }); 
      if(result?.error?.startsWith("Email not verified. A new verification email has been sent to your email address. You can login once you verify your email.")) {
          toast.error("Sign-in Failed", {
            description: "Email not verified. A new verification email has been sent to your email address. You can login once you verify your email."
          });
          const match = result.error.match(/username:(\w+)/);
          const username = match ? match[1] : null;
          if(username) router.replace(`/verify/${username}`)
        } else {
          toast.success("Sign-in Successful", {
            description: "You have successfully signed in!"
          });
        }
      
      if(result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred while signing in";
      toast.error("Sign-in Failed", {
        description: message || "An error occurred while signing in"
      });
    }finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Username or Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait </>) : "Sign Up"}
            </Button>
          </form>
        </Form>

        
        <div className="text-center mt-4">
          <p>
            New member?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page