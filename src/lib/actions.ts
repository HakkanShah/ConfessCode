'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Confession } from './types';
import { createServiceRoleServerClient } from './supabase/server';
import { cookies, headers } from 'next/headers';
import { PII_REGEX } from './utils';
import { isUserBanned, getLastPostTime } from './db';
import { redirect } from 'next/navigation';

const TEN_MINUTES = 10 * 60 * 1000;


// This function now handles all visibility logic internally.
// It fetches a broader set of data and filters it according to the rules.
export async function getConfessions(): Promise<Confession[]> {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const anonHash = cookieStore.get('anon_hash')?.value;

  // Fetches all approved confessions AND all posts by the current user (if any)
  let query = supabase
    .from('confessions')
    .select(
      `
      id,
      text,
      created_at,
      anon_hash,
      status,
      likes,
      dislikes,
      comments ( id, text, created_at, anon_hash, is_author ),
      post_interactions ( user_anon_hash, interaction_type )
    `
    )
    .order('created_at', { ascending: false })
    .order('created_at', { foreignTable: 'comments', ascending: true });
    
  if (anonHash) {
    query = query.or(`status.eq.approved,anon_hash.eq.${anonHash}`);
  } else {
    query = query.eq('status', 'approved');
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching confessions:', error.message);
    return [];
  }

  // Map Supabase response to Confession type
  const confessions = data.map((item: any) => {
    // Manually filter interactions for the current user if anonHash is present
    const userInteractions = anonHash
      ? item.post_interactions.filter((pi: any) => pi.user_anon_hash === anonHash)
      : [];

    return {
      id: item.id,
      text: item.text,
      timestamp: new Date(item.created_at),
      anonHash: item.anon_hash,
      status: item.status,
      likes: item.likes,
      dislikes: item.dislikes,
      comments: item.comments.map((c: any) => ({
        id: c.id,
        text: c.text,
        timestamp: new Date(c.created_at),
        anonHash: c.anon_hash,
        isAuthor: c.is_author,
      })),
      userInteraction: userInteractions.length > 0 ? userInteractions[0].interaction_type : null,
    } as Confession;
  });

  return confessions;
}


export async function getAllConfessionsForAdmin(): Promise<Confession[]> {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const { data, error } = await supabase
    .from('confessions')
    .select(
      `
        id,
        text,
        created_at,
        anon_hash,
        status,
        likes,
        dislikes,
        comments ( id, text, created_at, anon_hash, is_author )
      `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching confessions for admin:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    text: item.text,
    timestamp: new Date(item.created_at),
    anonHash: item.anon_hash,
    status: item.status,
    likes: item.likes,
    dislikes: item.dislikes,
    comments: item.comments.map((c: any) => ({
      id: c.id,
      text: c.text,
      timestamp: new Date(c.created_at),
      anonHash: c.anon_hash,
      isAuthor: c.is_author,
    })),
    userInteraction: null,
  }));
}

export async function updateConfessionStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const { data, error } = await supabase
    .from('confessions')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating confession status:', error);
    return { success: false, message: 'Failed to update confession.' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, message: `Confession ${status}.` };
}

const confessionSchema = z
  .string()
  .min(10, { message: 'Confession must be at least 10 characters long.' })
  .max(1000, {
    message: 'Confession must be no more than 1000 characters long.',
  });

export async function submitConfession(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const anonHash = cookieStore.get('anon_hash')?.value;

  if (!anonHash) {
    return {
      success: false,
      message: 'User not authenticated. Please activate your account.',
    };
  }

  const banned = await isUserBanned(anonHash);
  if (banned) {
    return {
      success: false,
      message: 'You are banned from posting confessions.',
    };
  }

  const lastPostTime = await getLastPostTime(anonHash);
  if (lastPostTime && Date.now() - lastPostTime.getTime() < TEN_MINUTES) {
    const remainingTime = Math.ceil(
      (TEN_MINUTES - (Date.now() - lastPostTime.getTime())) / 60000
    );
    return {
      success: false,
      message: `You must wait ${remainingTime} more minute(s) to post again.`,
    };
  }

  const rawConfession = formData.get('confession');
  const validatedFields = confessionSchema.safeParse(rawConfession);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    };
  }

  const confessionText = validatedFields.data;

  // Basic PII filtering
  if (
    confessionText.match(PII_REGEX.EMAIL) ||
    confessionText.match(PII_REGEX.PHONE)
  ) {
    return {
      success: false,
      message:
        'Confession appears to contain personal information. Please remove it.',
    };
  }

  try {
    const supabase = createServiceRoleServerClient(cookieStore);

    const { error } = await supabase.from('confessions').insert({
      text: confessionText,
      anon_hash: anonHash,
      status: 'pending', // Set status to 'pending' by default
    });

    if (error) {
      console.error('Error during confession submission:', error);
      return {
        success: false,
        message: 'Failed to submit confession. Database error.',
      };
    }

    revalidatePath('/');

    return {
      success: true,
      message: 'Your confession has been submitted for review. Thank you.',
    };
  } catch (error: any) {
    console.error('Full error during confession submission:', error);
    return {
      success: false,
      message: `An unexpected error occurred: ${error.message || 'Unknown error'}. Please try again later.`,
    };
  }
}

const activationSchema = z
  .string()
  .min(1, { message: 'Activation key is required.' });

export async function activateAccount(prevState: any, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const headerStore = headers();

  const rawActivationKey = formData.get('activationKey');
  const validatedFields = activationSchema.safeParse(rawActivationKey);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
      anonHash: null,
    };
  }

  if (validatedFields.data !== 'WELCOME') {
    return {
      success: false,
      message: 'Invalid activation key.',
      anonHash: null,
    };
  }

  const ip = headerStore.get('x-forwarded-for')?.split(',')[0].trim();
  const userAgent = headerStore.get('user-agent');

  // Check if IP already activated
  if (ip) {
    const { data: existingActivation, error: ipError } = await supabase
      .from('activations')
      .select('id')
      .eq('ip_address', ip)
      .single();

    if (existingActivation) {
      return {
        success: false,
        message: 'This IP address has already been used to activate an account.',
        anonHash: null,
      };
    }
  }

  const anonHash = crypto.randomUUID();

  const { error: insertError } = await supabase.from('activations').insert({
    anon_hash: anonHash,
    ip_address: ip,
    user_agent: userAgent,
  });

  if (insertError) {
    console.error('Error saving activation:', insertError);
    return {
      success: false,
      message: 'Could not save activation details. Please try again.',
      anonHash: null,
    };
  }

  return {
    success: true,
    message: 'Account activated! You can now share your confessions.',
    anonHash: anonHash,
  };
}

async function handleInteraction(
  confessionId: string,
  interactionType: 'like' | 'dislike'
) {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const anonHash = cookieStore.get('anon_hash')?.value;

  if (!anonHash) {
    return { success: false, message: 'User not authenticated.' };
  }

  // 1. Check for an existing interaction by this user on this post
  const { data: existingInteraction, error: fetchError } = await supabase
    .from('post_interactions')
    .select('*')
    .eq('confession_id', confessionId)
    .eq('user_anon_hash', anonHash)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is fine.
    console.error('Error fetching interaction:', fetchError);
    return { success: false, message: 'Database error fetching interaction.' };
  }

  if (existingInteraction) {
    // Scenario 1: User is removing or changing their interaction
    const isSameInteraction = existingInteraction.interaction_type === interactionType;

    // First, delete the old interaction record
    const { error: deleteError } = await supabase
      .from('post_interactions')
      .delete()
      .eq('id', existingInteraction.id);

    if (deleteError) {
        console.error('Error deleting interaction:', deleteError);
        return { success: false, message: 'Database error deleting interaction.' };
    }

    // Decrement the old count (e.g., remove their like)
    if (existingInteraction.interaction_type === 'like') {
        await supabase.rpc('decrement_count', { row_id: confessionId, column_name: 'likes' });
    } else {
        await supabase.rpc('decrement_count', { row_id: confessionId, column_name: 'dislikes' });
    }

    if (!isSameInteraction) {
      // Scenario 1a: User is switching vote (e.g., from like to dislike)
      // We've already removed the old vote, now add the new one.
      const { error: insertError } = await supabase
        .from('post_interactions')
        .insert({
          confession_id: confessionId,
          user_anon_hash: anonHash,
          interaction_type: interactionType,
        });

       if (insertError) {
            console.error('Error inserting new interaction:', insertError);
            return { success: false, message: 'Database error inserting new interaction.' };
       }
       // Increment the new count
        if (interactionType === 'like') {
            await supabase.rpc('increment_count', { row_id: confessionId, column_name: 'likes' });
        } else {
            await supabase.rpc('increment_count', { row_id: confessionId, column_name: 'dislikes' });
        }
    }
    // Scenario 1b: User is undoing their vote. We've deleted it, so we're done.

  } else {
    // Scenario 2: User is adding a new interaction to a post they haven't interacted with
    const { error: insertError } = await supabase
      .from('post_interactions')
      .insert({
        confession_id: confessionId,
        user_anon_hash: anonHash,
        interaction_type: interactionType,
      });

    if (insertError) {
        console.error('Error inserting new interaction:', insertError);
        return { success: false, message: 'Database error on new interaction.' };
    }
    // Increment the new count
    if (interactionType === 'like') {
        await supabase.rpc('increment_count', { row_id: confessionId, column_name: 'likes' });
    } else {
        await supabase.rpc('increment_count', { row_id: confessionId, column_name: 'dislikes' });
    }
  }

  revalidatePath('/');
  return { success: true };
}


export async function handleLike(confessionId: string) {
    return handleInteraction(confessionId, 'like');
}

export async function handleDislike(confessionId: string) {
    return handleInteraction(confessionId, 'dislike');
}

const commentSchema = z
  .string()
  .min(1, 'Comment cannot be empty.')
  .max(500, 'Comment is too long.');

export async function addComment(confessionId: string, formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const anonHash = cookieStore.get('anon_hash')?.value;

  if (!anonHash) {
    return {
      success: false,
      message: 'Could not add comment. User not authenticated.',
    };
  }

  const banned = await isUserBanned(anonHash);
  if (banned) {
    return {
      success: false,
      message: 'You are banned from posting comments.',
    };
  }

  const validatedFields = commentSchema.safeParse(formData.get('comment'));

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  const { data: confessionAuthor } = await supabase
    .from('confessions')
    .select('anon_hash')
    .eq('id', confessionId)
    .single();

  if (!confessionAuthor) {
    return { success: false, message: 'Confession not found.' };
  }

  const isAuthor = confessionAuthor.anon_hash === anonHash;

  const { error } = await supabase.from('comments').insert({
    text: validatedFields.data,
    confession_id: confessionId,
    anon_hash: anonHash,
    is_author: isAuthor,
  });

  if (error) {
    console.error('Error adding comment', error);
    return { success: false, message: 'Failed to add comment.' };
  }

  revalidatePath('/');
  return { success: true };
}

async function handleReport(contentId: string, contentType: 'confession' | 'comment') {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const anonHash = cookieStore.get('anon_hash')?.value;

  if (!anonHash) {
    return { success: false, message: 'You must be logged in to report content.' };
  }

  const { error } = await supabase.from('reports').insert({
    content_id: contentId,
    content_type: contentType,
    reporter_anon_hash: anonHash,
    status: 'pending',
  });

  if (error) {
    if (error.code === '23505') { // unique_violation
      return { success: false, message: 'You have already reported this content.' };
    }
    console.error(`Error reporting ${contentType}:`, error);
    return { success: false, message: `Failed to report ${contentType}.` };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, message: 'Content reported for review.' };
}

export async function reportConfession(confessionId: string) {
    return handleReport(confessionId, 'confession');
}

export async function reportComment(commentId: string) {
    return handleReport(commentId, 'comment');
}


export async function deleteConfession(confessionId: string) {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const { error } = await supabase
    .from('confessions')
    .delete()
    .eq('id', confessionId);
  if (error) {
    return { success: false, message: 'Failed to delete confession.' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, message: 'Confession deleted.' };
}

export async function deleteComment(commentId: string) {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  if (error) {
    return { success: false, message: 'Failed to delete comment.' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, message: 'Comment deleted.' };
}

export async function banUser(anonHash: string) {
  const cookieStore = cookies();
  const supabase = createServiceRoleServerClient(cookieStore);
  const { error } = await supabase
    .from('banned_users')
    .insert({ anon_hash: anonHash });

  if (error) {
    if (error.code === '23505') {
      // unique constraint violation
      return { success: false, message: 'User is already banned.' };
    }
    return { success: false, message: 'Failed to ban user.' };
  }

  revalidatePath('/admin');
  return {
    success: true,
    message: `User ${anonHash.substring(0, 6)}... has been banned.`,
  };
}


const adminAuthSchema = z.string().min(1, 'Secret key is required.');

export async function authenticateAdmin(prevState: any, formData: FormData) {
  const rawSecretKey = formData.get('secretKey');
  const validatedFields = adminAuthSchema.safeParse(rawSecretKey);

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.issues[0].message,
    };
  }

  if (validatedFields.data === process.env.ADMIN_SECRET_KEY) {
    const cookieStore = cookies();
    cookieStore.set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return {
      success: true,
      message: 'Successfully authenticated!',
    };
  } else {
    return {
      success: false,
      message: 'Invalid secret key.',
    };
  }
}

export async function signOutAdmin() {
  const cookieStore = cookies();
  cookieStore.delete('admin-auth');
  redirect('/admin/login');
}
