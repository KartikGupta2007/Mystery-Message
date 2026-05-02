import { UserModel } from '@/model/user.model';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageid: string }> }
) {
  const resolvedParams = await params;
  const messageId = resolvedParams?.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // attempt to match by ObjectId when possible
    let pullMatcher: any = { _id: messageId };
    try {
      pullMatcher = { _id: new mongoose.Types.ObjectId(messageId) };
    } catch (e) {
      // leave as string if it cannot be converted
      pullMatcher = { _id: messageId };
    }

    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: pullMatcher } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}