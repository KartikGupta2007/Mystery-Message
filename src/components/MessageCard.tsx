"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { toast } from "sonner"
import { ApiResponse } from "@/utils/ApiResponse"
import { Message } from "@/model/user.model"
import axios from "axios"

function MessageCard({ message, onMessageDelete }: { message: Message; onMessageDelete: (messageId: string) => void }) {
  async function handleDeleteConfirm() {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      if (response.data.success) {
        onMessageDelete(message._id.toString());
        toast.success(response.data.message || "Message deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete message");
      }
    } catch (err) {
      toast.error("Failed to delete message");
    }
  }

  const createdAt = message.createdAt ? new Date(message.createdAt).toLocaleString() : "Unknown";

  return (
    <Card className="relative">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 text-destructive hover:bg-destructive/10"
            aria-label="Delete message"
          >
            <X className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this anonymous message. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardContent className="pt-6 pb-3 px-6">
        <p className="text-base leading-relaxed">{message.content}</p>
      </CardContent>

      <CardFooter className="px-6 pb-4">
        <p className="text-sm text-muted-foreground">{createdAt}</p>
      </CardFooter>
    </Card>
  );
}

export default MessageCard