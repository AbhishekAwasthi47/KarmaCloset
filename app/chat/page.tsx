'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { MessageCircle, Send, ArrowLeft, Repeat2, Leaf, ShoppingBag, Loader as Loader2, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Conversation {
  swap_offer_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  item_title: string;
  item_image: string | null;
  last_message: string;
  last_message_at: string;
  unread: number;
  status: string;
}

interface ChatMessage {
  id: string;
  swap_offer_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const { data: offers } = await supabase
      .from('swap_offers')
      .select('id, status, initiator_id, receiver_id, requested_item_id, created_at, updated_at')
      .or(`initiator_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (!offers || offers.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const convos: Conversation[] = [];
    for (const offer of offers) {
      const isInitiator = offer.initiator_id === user.id;
      const otherId = isInitiator ? offer.receiver_id : offer.initiator_id;

      const { data: otherProfile } = await supabase
        .from('profiles')
        .select('name, avatar')
        .eq('id', otherId)
        .maybeSingle();

      const { data: product } = await supabase
        .from('products')
        .select('title, images')
        .eq('id', offer.requested_item_id)
        .maybeSingle();

      const { data: lastMsg } = await supabase
        .from('chat_messages')
        .select('text, created_at')
        .eq('swap_offer_id', offer.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      convos.push({
        swap_offer_id: offer.id,
        other_user_id: otherId,
        other_user_name: otherProfile?.name || 'User',
        other_user_avatar: otherProfile?.avatar || null,
        item_title: product?.title || 'Item',
        item_image: product?.images?.[0] || null,
        last_message: lastMsg?.text || 'No messages yet',
        last_message_at: lastMsg?.created_at || offer.created_at,
        unread: 0,
        status: offer.status,
      });
    }

    setConversations(convos);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const fetchMessages = useCallback(async (swapOfferId: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('swap_offer_id', swapOfferId)
      .order('created_at', { ascending: true });
    setMessages((data as ChatMessage[]) || []);
  }, []);

  useEffect(() => {
    if (activeConvo) fetchMessages(activeConvo);
  }, [activeConvo, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConvo || !user) return;
    setSending(true);

    await supabase.from('chat_messages').insert({
      swap_offer_id: activeConvo,
      sender_id: user.id,
      text: newMessage.trim(),
    });

    setNewMessage('');
    await fetchMessages(activeConvo);
    setSending(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-forest-300" />
        </div>
        <h2 className="text-xl font-bold text-forest-900 mb-2">Login to Chat</h2>
        <p className="text-sm text-forest-600 mb-6">Sign in to negotiate swaps and deals.</p>
        <Link href="/login">
          <Button className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl">Login</Button>
        </Link>
      </div>
    );
  }

  const activeConvoData = conversations.find((c) => c.swap_offer_id === activeConvo);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-forest-900">Karma Chat</h1>
        <p className="text-sm text-forest-600">Negotiate swaps and deals with fellow closet cleaners.</p>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Conversation List */}
        <div className={cn(
          'w-full md:w-80 shrink-0 flex flex-col bg-white rounded-2xl border border-sage-100 shadow-card overflow-hidden',
          activeConvo ? 'hidden md:flex' : 'flex'
        )}>
          <div className="p-3 border-b border-sage-100">
            <p className="text-xs font-semibold text-forest-500 uppercase tracking-widest">Conversations</p>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-forest-300" />
              </div>
              <p className="text-sm font-semibold text-forest-800 mb-1">No conversations yet</p>
              <p className="text-xs text-forest-500 mb-3">Start a swap to begin chatting</p>
              <Link href="/marketplace">
                <Button size="sm" className="bg-forest-600 hover:bg-forest-700 text-white rounded-lg text-xs">
                  Browse the Closet
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.map((convo) => (
                <button
                  key={convo.swap_offer_id}
                  onClick={() => setActiveConvo(convo.swap_offer_id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 hover:bg-sage-50 transition-colors text-left border-b border-sage-50',
                    activeConvo === convo.swap_offer_id && 'bg-forest-50 border-l-2 border-l-forest-600'
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-sage-100 overflow-hidden shrink-0">
                    {convo.other_user_avatar ? (
                      <img src={convo.other_user_avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-forest-100">
                        <span className="text-sm font-bold text-forest-600">
                          {convo.other_user_name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-forest-800 truncate">{convo.other_user_name}</p>
                      <span className={cn(
                        'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                        convo.status === 'pending' ? 'bg-sand-100 text-sand-700' :
                        convo.status === 'accepted' ? 'bg-forest-100 text-forest-700' :
                        'bg-sage-100 text-forest-500'
                      )}>
                        {convo.status}
                      </span>
                    </div>
                    <p className="text-xs text-forest-500 truncate">{convo.item_title}</p>
                    <p className="text-[11px] text-forest-400 truncate mt-0.5">{convo.last_message}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {activeConvo && activeConvoData ? (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-sage-100 shadow-card overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 border-b border-sage-100">
              <button
                onClick={() => setActiveConvo(null)}
                className="md:hidden p-1 rounded-lg hover:bg-sage-50"
              >
                <ArrowLeft className="w-4 h-4 text-forest-600" />
              </button>
              <div className="w-8 h-8 rounded-full bg-sage-100 overflow-hidden">
                {activeConvoData.other_user_avatar ? (
                  <img src={activeConvoData.other_user_avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-forest-100">
                    <User className="w-4 h-4 text-forest-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-forest-800">{activeConvoData.other_user_name}</p>
                <p className="text-[11px] text-forest-500 flex items-center gap-1">
                  <Repeat2 className="w-3 h-3" /> Re: {activeConvoData.item_title}
                </p>
              </div>
              <Badge className={cn(
                'text-[9px] font-bold',
                activeConvoData.status === 'pending' ? 'bg-sand-100 text-sand-700' :
                activeConvoData.status === 'accepted' ? 'bg-forest-100 text-forest-700' :
                'bg-sage-100 text-forest-500'
              )}>
                {activeConvoData.status}
              </Badge>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-3">
                    <MessageCircle className="w-6 h-6 text-forest-300" />
                  </div>
                  <p className="text-sm font-semibold text-forest-800">Start the conversation</p>
                  <p className="text-xs text-forest-500 mt-1">Say hello and discuss the swap details</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        'max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                        isMine
                          ? 'bg-forest-600 text-white rounded-br-md'
                          : 'bg-sage-100 text-forest-800 rounded-bl-md'
                      )}>
                        <p>{msg.text}</p>
                        <p className={cn(
                          'text-[10px] mt-1',
                          isMine ? 'text-forest-200' : 'text-forest-400'
                        )}>
                          {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-sage-100">
              <div className="flex items-center gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sage-200 text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-all"
                />
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  size="sm"
                  className="bg-forest-600 hover:bg-forest-700 text-white rounded-xl h-10 w-10 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-white rounded-2xl border border-sage-100 shadow-card">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-forest-300" />
            </div>
            <p className="text-sm font-semibold text-forest-800 mb-1">Select a conversation</p>
            <p className="text-xs text-forest-500">Choose a swap to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
