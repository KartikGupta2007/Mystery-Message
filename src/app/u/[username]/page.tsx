'use client';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/utils/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).filter(Boolean);
};

const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? '';
  const isUsernameValid = Boolean(username);

  const [completion, setCompletion] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!isUsernameValid) {
      toast.error('Invalid profile link');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Failed to send message', {
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    if (!isUsernameValid) {
      toast.error('Invalid profile link');
      return;
    }

    setIsSuggestLoading(true);
    setError(null);
    setCompletion('');
    try {
      const res = await fetch('/api/suggest-messages', { method: 'POST' });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) {
        const text = await res.text();
        setCompletion(text || initialMessageString);
        return;
      }

      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        // eslint-disable-next-line no-await-in-loop
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setCompletion((prev) => prev + chunk);
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
      setCompletion(initialMessageString);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 py-12">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Public Profile Link</h1>
        <p className="text-center text-sm text-gray-600">Send an anonymous message to @{username}</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 my-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">Suggested Messages</div>
            <Button onClick={fetchSuggestedMessages} disabled={isSuggestLoading}>
              {isSuggestLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Suggest Messages'
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {error ? (
              <div className="text-red-500">{error.message}</div>
            ) : (
              parseStringMessages(completion).map((message, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="text-left"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </div>
        </div>

        <Separator className="my-2" />

        <div className="text-center">
          <div className="mb-2">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}