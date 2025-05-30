// src/pages/MomContent.jsx
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import  api  from '../lib/api';

export default function MomContent() {
  const queryClient = useQueryClient();
  const [content, setContent] = useState({ posts: [], articles: [] });
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    api
      .getContent()
      .then(res => setContent(res.data))
      .catch(console.error);
  }, []);

  const shareMutation = useMutation({
    mutationFn: ({ contentType, contentId, recipientEmail }) =>
      recipientEmail
        ? api.shareViaEmail(contentType, contentId, recipientEmail)
        : api.shareContent(contentType, contentId),
    onSuccess: () => {
      setShareMsg('Content shared successfully!');
      setTimeout(() => setShareMsg(''), 3000);
    },
    onError: () => {
      setShareMsg('Error sharing content');
      setTimeout(() => setShareMsg(''), 3000);
    },
  });

  const handleShare = (contentType, contentId, recipientEmail = null) => {
    shareMutation.mutate({ contentType, contentId, recipientEmail });
  };

  return (
  <div className="space-y-8">
    {shareMsg && (
      <p className={`text-center font-medium ${shareMsg.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
        {shareMsg}
      </p>
    )}

    <section>
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">Community Posts</h2>
      {content.posts.map((p, i) => (
        <div key={i} className="mb-4 p-4 bg-white border border-cyan-200 rounded-md shadow-sm">
          <h3 className="font-semibold text-gray-600">{p.title}</h3>
          <p className="text-gray-600 font-medium">{p.content}</p>
          <div className="mt-2 flex gap-4">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1 rounded-md font-semibold"
              onClick={() => handleShare('post', p.id)}
            >
              Share
            </button>
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1 rounded-md font-semibold"
              onClick={() => {
                const email = prompt('Enter recipient email:');
                if (email) handleShare('post', p.id, email);
              }}
            >
              Share via Email
            </button>
          </div>
        </div>
      ))}
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">Approved Articles</h2>
      {content.articles.map((a, i) => (
        <div key={i} className="mb-4 p-4 bg-white border border-cyan-200 rounded-md shadow-sm">
          <h3 className="font-semibold text-gray-600">{a.title}</h3>
          <p className="italic text-gray-600 font-medium">{a.category}</p>
          <p className="text-gray-600 font-medium">{a.content}</p>
          <div className="mt-2 flex gap-4">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1 rounded-md font-semibold"
              onClick={() => handleShare('article', a.id)}
            >
              Share
            </button>
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1 rounded-md font-semibold"
              onClick={() => {
                const email = prompt('Enter recipient email:');
                if (email) handleShare('article', a.id, email);
              }}
            >
              Share via Email
            </button>
          </div>
        </div>
      ))}
    </section>
  </div>
);
}