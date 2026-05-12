import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LinkifiedText from '../components/LinkifiedText';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PublicBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/posts`)
      .then(r => setPosts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2.5rem', borderBottom:'1px solid #eee', paddingBottom:'1rem' }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>My Blog</h1>
        <button
          onClick={() => navigate('/admin')}
          style={{ fontSize:13, padding:'6px 14px', border:'1px solid #ddd', borderRadius:8, background:'transparent', cursor:'pointer' }}
        >
          Admin
        </button>
      </div>

      {loading ? (
        <p style={{ color:'#888' }}>Loading...</p>
      ) : posts.length === 0 ? (
        <p style={{ color:'#888' }}>No posts yet.</p>
      ) : posts.map(post => (
        <div key={post._id} style={{ marginBottom:'2.5rem', paddingBottom:'2.5rem', borderBottom:'1px solid #f0f0f0' }}>
          <p style={{ fontSize:12, color:'#999', marginBottom:6 }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
          </p>
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:10 }}>{post.title}</h2>
          {/* Body text: URLs are auto-linked, newlines become line breaks */}
          <p style={{ fontSize:14, color:'#444', lineHeight:1.75, whiteSpace:'pre-wrap' }}>
            <LinkifiedText text={post.body} />
          </p>
        </div>
      ))}
    </div>
  );
}
