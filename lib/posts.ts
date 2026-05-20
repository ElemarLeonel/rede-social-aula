import { supabase } from "./supabase";

interface Author {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
}

// export existe pois iremos utilizar em outros locais fora deste arquivo
export interface Posts {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    deleted_at: string; // Soft deletes
    author: Author | null;
    likes_count: number;
    liked_by_user: boolean;
}

interface ToggleLikePostResult {
    liked: boolean;
    likes_count: number;
}

export async function fetchPosts(currentUserId: string): Promise<Posts[]> {
    const { data: posts, error: postsError } = 
        await supabase.from('posts') // Busco da tabela posts
        .select(`
            id,
            user_id,
            content,
            created_at,
            updated_at,
            deleted_at,
            profiles:user_id (
                id,
                name,
                username,
                avatar_url
            )
            `) // Trago os campos do post junto com os dados do usuário que fez o post
            .is('deleted_at', null) // Valido se o post foi deletado 
            .order('created_at', { ascending: false }); // Ordeno de forma descendente (do post mais recente para o mais antigo)

        // Validação de erros
        if(postsError) throw postsError;

        // Tratamento para retorno de dados vazios
        if(!posts) return [];
        
        const { data: likes, error: likesError } = 
            await supabase.from('post_likes')
            .select('user_id, post_id');

        if(likesError) throw likesError;

        return posts.map((post: any) => ({
            id: post.id,
            user_id: post.user_id,
            content: post.content,
            created_at: post.created_at,
            updated_at: post.updated_at ?? null,
            deleted_at: post.deleted_at,
            author: post.profiles ?? null,
            likes_count: (likes ?? []).filter((l: any) => l.post_id === post.id).length,
            liked_by_user: (likes ?? []).some((l: any) => l.post_id === post.id && l.user_id === currentUserId)
        }))
}

// Agora que vocês posts de um usuário em específico

export async function fetchUserPosts(userId: string, currentUserId: string): Promise<Posts[]> {
    const { data: posts, error: postsError } = 
        await supabase.from('posts') // Busco da tabela posts
        .select(`
            id,
            user_id,
            content,
            created_at,
            updated_at,
            deleted_at,
            profiles:user_id (
                id,
                name,
                username,
                avatar_url
            )
            `) // Trago os campos do post junto com os dados do usuário que fez o post
            .eq('user_id', userId) // Seja igual o usuário que foi solicitado na função
            .is('deleted_at', null) // Valido se o post foi deletado 
            .order('created_at', { ascending: false }); // Ordeno de forma descendente (do post mais recente para o mais antigo)
            
    if(postsError) throw postsError;
    if(!posts) return [];

    const postIds = posts.map((p: any) => p.id);

    const { data: likes, error: likesError } = 
        await supabase.from('post_likes')
        .select('user_id, post_id')
        .in('post_id', postIds) // Verifica se contaIN o que estamos pesquisando dentro da tabela

    if(likesError) throw likesError;

    return posts.map((post: any) => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at ?? null,
        deleted_at: post.deleted_at,
        author: post.profiles ?? null,
        likes_count: (likes ?? []).filter((l: any) => l.post_id === post.id).length,
        liked_by_user: (likes ?? []).some((l: any) => l.post_id === post.id && l.user_id === currentUserId)
    }))
}

export async function toggleLikePost(
    postId: string,
    userId: string
): Promise<ToggleLikePostResult> {
    const { data: existingLike, error: existingLikeError } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existingLikeError) throw existingLikeError;

    if (existingLike) {
        const { error: deleteLikeError } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);

        if (deleteLikeError) throw deleteLikeError;
    } else {
        const { error: insertLikeError } = await supabase
            .from('post_likes')
            .insert({
                post_id: postId,
                user_id: userId
            });

        if (insertLikeError) throw insertLikeError;
    }

    const { count, error: countError } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

    if (countError) throw countError;

    return {
        liked: !existingLike,
        likes_count: count ?? 0
    };
}
