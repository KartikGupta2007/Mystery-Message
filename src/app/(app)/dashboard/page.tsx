"use client";
import React, { useCallback, useEffect } from 'react'
import { Message } from '@/model/user.model'; 
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/utils/ApiResponse';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw, Copy } from 'lucide-react';
import MessageCard from '@/components/MessageCard';
import { Textarea } from '@/components/ui/textarea';

function page() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = React.useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message._id.toString() !== messageId));
  }
  const { data: session, status } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      isAcceptingMessages: true,
    },
  })
  const {register, watch, setValue} = form;
  const acceptMessage = watch("isAcceptingMessages");

  const fetchAcceptMessage = useCallback( async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-mesage");
      setValue("isAcceptingMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch message acceptance status");
    } finally {
      setIsSwitchLoading(false);
    }
  },[setValue])

  //handle switch change
  const handleAcceptMessageChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-mesage", { acceptingMessage : !acceptMessage });
      setValue("isAcceptingMessages", !acceptMessage);
      toast.success(response.data.message || "Message acceptance status updated successfully");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update message acceptance status");
    } finally {
      setIsSwitchLoading(false);
    }
  }

  const fetchMessages = useCallback(async (refresh:boolean = false) => {
    setLoading(true);
    // setIsSwitchLoading(false);
    try {
      if(refresh) {
        toast("Refreshing messages...")
      }
      const response = await fetch("/api/get-messages");
      const data = await response.json();
      if (data?.success) {
        setMessages(data.messages || []);
      } else {
        toast.error(data.message || "Failed to fetch messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "An error occurred while fetching messages");
    } finally {
      setLoading(false);
    }
  },[setLoading, setMessages]);

  useEffect(() => {
    if(!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  },[session, setValue, fetchMessages, fetchAcceptMessage])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    .then(() => {
      toast.success("Profile URL copied to clipboard");
    })
    .catch(() => {
      toast.error("Failed to copy profile URL");
    })
  }

  if(status === "loading" || loading) {
    return (
      <div className='w-full max-w-7xl mx-auto flex items-center justify-center h-96'>
        <span className='text-sm text-muted-foreground'>Loading...</span>
      </div>
    )
  }
  if(status !== "authenticated") {
    return (
      <div className='w-full max-w-7xl mx-auto flex items-center justify-center h-96'>
        <span className='text-sm text-muted-foreground'>You must be signed in to view this page.</span>
      </div>
    )
  }

  const username = session?.user?.username;
  const baeUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baeUrl}/u/${username}`;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-800 py-12">
      <div className="w-full max-w-6xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Your Unique Profile Link</h2>
          <div className="flex items-end gap-2">
            <Textarea
              value={profileUrl}
              disabled
              readOnly
              className="resize-none bg-gray-100 text-gray-800 font-mono text-sm flex-1"
              rows={1}
            />
            <Button onClick={copyToClipboard} className="gap-2">
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <Switch
            {...register('isAcceptingMessages')}
            checked={acceptMessage}
            onCheckedChange={handleAcceptMessageChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-4">
            Accept Messages: {acceptMessage ? 'On' : 'Off'}
          </span>
        </div>
        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default page