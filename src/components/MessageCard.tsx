"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

function MessageCard({message, onMessageDelete} : {message: Message, onMessageDelete: (messageId: string) => void}) {
    
    async function handleDeleteConfirm() {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        if (response.data.success) {
            onMessageDelete(message._id.toString())
            toast.success(response.data.message || "Message deleted successfully")
        } else {
            toast.error(response.data.message || "Failed to delete message")
        }
    }

  return (
    <Card>
    <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className='w-5 h-5'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        <CardDescription>Card Description</CardDescription>
    </CardHeader>
    <CardContent>
        <p>Card Content</p>
    </CardContent>
    <CardFooter>
        <p>Card Footer</p>
    </CardFooter>
    </Card>
  )
}

export default MessageCard;