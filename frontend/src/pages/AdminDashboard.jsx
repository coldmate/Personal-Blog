import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const s = {
  btn: { fontSize:13, padding:'6px 12px', border:'1px solid #ddd', borderRadius:8, background:'transparent', cursor:'pointer', fontFamily:'inherit' },
  btnPrimary: { fontSize:13, padding:'6px 14px', border:'none', borderRadius:8, background:'#111', color:'#fff', cursor:'pointer', fontFamily:'inherit' },
  input: { width:'100%', fontSize:14, padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, fontFamily:'inherit', marginTop:4, outline:'none' },
  label: { fontSize:12, color:'#666', fontWeight:500 },
};

export default function AdminDashboard() {
  const { getAccessTokenSilently, logout } = useAuth0();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tab, setTab] = useState('posts');
  const [msg, setMsg] = useState('');

  const getToken = () => getAccessTokenSilently();

  const fetchPosts = async () => {
    try {
      const token = await getToken();
      const r = await axios.get(`${API}/api/posts`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(r.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePublish = async () => {
    if (!title.trim() || !body.trim()) return setMsg('Title and content are required.');
    try {
      const token = await getToken();
      await axios.post(`${API}/api/posts`,
        { title, body },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setTitle(''); setBody('');
      setMsg('Post published successfully!');
      setTab('posts');
      fetchPosts();
      setTimeout(() => setMsg(''), 3000);
    } catch (e) { setMsg('Error publishing post.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API}/api/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchPosts();
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', borderBottom:'1px solid #eee', paddingBottom:'1rem' }}>
        <h1 style={{ fontSize:18, fontWeight:600 }}>Admin Panel</h1>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => window.location.href='/'} style={s.btn}>View Blog</button>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} style={s.btn}>Sign out</button>
        </div>
      </div>

      {msg && (
        <div style={{ background:'#f0faf0', border:'1px solid #c3e6cb', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:'1rem' }}>
          {msg}
        </div>
      )}

      <div style={{ display:'flex', gap:4, background:'#f5f5f5', borderRadius:8, padding:3, marginBottom:'1.5rem' }}>
        {['posts','new'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'7px', borderRadius:6, border: tab===t ? '1px solid #ddd' : 'none', background: tab===t ? '#fff' : 'transparent', fontFamily:'inherit', fontSize:13, cursor:'pointer', fontWeight: tab===t ? 500 : 400 }}>
            {t === 'posts' ? 'All Posts' : 'New Post'}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <p style={{ color:'#888', fontSize:14 }}>No posts yet. Create your first one!</p>
          ) : posts.map(post => (
            <div key={post._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', border:'1px solid #eee', borderRadius:8, marginBottom:8 }}>
              <div>
                <p style={{ fontWeight:500, fontSize:14 }}>{post.title}</p>
                <p style={{ fontSize:12, color:'#999', marginTop:2 }}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
                </p>
              </div>
              <button onClick={() => handleDelete(post._id)} style={{ ...s.btn, color:'#c0392b', borderColor:'#f5c6cb' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'new' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
          <div>
            <label style={s.label}>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title..." style={s.input} />
          </div>
          <div>
            <label style={s.label}>Content *</label>
            <p style={{ fontSize:11, color:'#999', marginTop:4 }}>Any URLs you type (https://...) will be automatically clickable on the public blog.</p>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your post... URLs like https://example.com will be auto-linked."
              style={{ ...s.input, minHeight:220, resize:'vertical', lineHeight:1.75 }}
            />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'0.75rem', borderTop:'1px solid #eee' }}>
            <span style={{ fontSize:12, color:'#999' }}>Timestamp added automatically on publish</span>
            <button onClick={handlePublish} style={s.btnPrimary}>Publish post</button>
          </div>
        </div>
      )}
    </div>
  );
}
