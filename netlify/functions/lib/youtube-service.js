// netlify/functions/lib/youtube-service.js
// YouTube API integration for featured videos and playlists

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCxxxxxxxxxxxxxx';

export async function getChannelPlaylists() {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('[YOUTUBE-SERVICE] API key not configured');
      return [];
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
    url.searchParams.append('part', 'snippet,contentDetails');
    url.searchParams.append('channelId', CHANNEL_ID);
    url.searchParams.append('maxResults', '50');
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      console.error('[YOUTUBE-SERVICE] API error:', data.error);
      return [];
    }

    return (data.items || []).map(item => ({
      playlistId: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.default?.url,
      videoCount: item.contentDetails?.itemCount || 0
    }));
  } catch (error) {
    console.error('[YOUTUBE-SERVICE] getChannelPlaylists error:', error);
    return [];
  }
}

export async function getPlaylistVideos(playlistId) {
  try {
    if (!YOUTUBE_API_KEY) return [];

    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.append('part', 'snippet,contentDetails');
    url.searchParams.append('playlistId', playlistId);
    url.searchParams.append('maxResults', '50');
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      console.error('[YOUTUBE-SERVICE] API error:', data.error);
      return [];
    }

    return (data.items || []).map(item => ({
      videoId: item.contentDetails?.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.default?.url,
      position: item.snippet.position
    }));
  } catch (error) {
    console.error('[YOUTUBE-SERVICE] getPlaylistVideos error:', error);
    return [];
  }
}

export async function getVideoDetails(videoId) {
  try {
    if (!YOUTUBE_API_KEY) return null;

    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.append('part', 'snippet,contentDetails,statistics');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error || !data.items || data.items.length === 0) {
      console.error('[YOUTUBE-SERVICE] Video not found:', videoId);
      return null;
    }

    const video = data.items[0];
    return {
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      duration: video.contentDetails.duration,
      viewCount: video.statistics?.viewCount || 0,
      likeCount: video.statistics?.likeCount || 0,
      commentCount: video.statistics?.commentCount || 0
    };
  } catch (error) {
    console.error('[YOUTUBE-SERVICE] getVideoDetails error:', error);
    return null;
  }
}

export async function getFeaturedVideos(maxResults = 20) {
  try {
    if (!YOUTUBE_API_KEY) return [];

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('channelId', CHANNEL_ID);
    url.searchParams.append('order', 'date');
    url.searchParams.append('type', 'video');
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      console.error('[YOUTUBE-SERVICE] API error:', data.error);
      return [];
    }

    return (data.items || []).map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.default?.url
    }));
  } catch (error) {
    console.error('[YOUTUBE-SERVICE] getFeaturedVideos error:', error);
    return [];
  }
}
