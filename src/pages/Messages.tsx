import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  thread_id: string;
  created_at: string;
  read: boolean;
  sender: {
    business_name: string;
    role: string;
  };
}

interface MessageThread {
  id: string;
  subject: string;
  participants: string[];
  last_message_at: string;
  last_message: string;
  unread_count: number;
  other_participant: {
    id: string;
    business_name: string;
    role: string;
  };
}

export default function Messages() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchThreads();
      setupRealtimeSubscription();
    }
  }, [user]);

  useEffect(() => {
    const threadId = searchParams.get('thread');
    if (threadId && threads.length > 0) {
      const thread = threads.find(t => t.id === threadId);
      if (thread) {
        setSelectedThread(thread);
      }
    }
  }, [searchParams, threads]);

  useEffect(() => {
    if (selectedThread) {
      fetchMessages(selectedThread.id);
      markThreadAsRead(selectedThread.id);
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('message_threads')
        .select(`
          *,
          messages!inner (
            content,
            created_at,
            sender_id
          )
        `)
        .contains('participants', [user.id])
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Process threads to get other participant info and unread counts
      const processedThreads = await Promise.all(
        (data || []).map(async (thread) => {
          const otherParticipantId = thread.participants.find((id: string) => id !== user.id);
          
          const { data: participantData } = await supabase
            .from('profiles')
            .select('id, business_name, role')
            .eq('id', otherParticipantId)
            .single();

          const { data: unreadMessages } = await supabase
            .from('messages')
            .select('id')
            .eq('thread_id', thread.id)
            .eq('recipient_id', user.id)
            .eq('read', false);

          return {
            ...thread,
            other_participant: participantData,
            unread_count: unreadMessages?.length || 0,
            last_message: thread.messages[0]?.content || 'No messages yet'
          };
        })
      );

      setThreads(processedThreads);
    } catch (error) {
      console.error('Error fetching threads:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            business_name,
            role
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  };

  const markThreadAsRead = async (threadId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('thread_id', threadId)
        .eq('recipient_id', user.id);

      if (error) throw error;

      // Update local state
      setThreads(prev =>
        prev.map(thread =>
          thread.id === threadId ? { ...thread, unread_count: 0 } : thread
        )
      );
    } catch (error) {
      console.error('Error marking thread as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || sending) return;

    try {
      setSending(true);
      const recipientId = selectedThread.participants.find(id => id !== user.id);

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage.trim(),
            sender_id: user.id,
            recipient_id: recipientId,
            thread_id: selectedThread.id
          }
        ]);

      if (error) throw error;

      // Update thread's last message timestamp
      await supabase
        .from('message_threads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedThread.id);

      setNewMessage('');
      fetchMessages(selectedThread.id);
      fetchThreads();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages'
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          if (selectedThread && newMessage.thread_id === selectedThread.id) {
            fetchMessages(selectedThread.id);
          }
          fetchThreads();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const filteredThreads = threads.filter(thread =>
    thread.other_participant?.business_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Messages</h1>
            <p className="text-muted-foreground">
              Communicate with your business partners
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-1">
                  {filteredThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border ${
                        selectedThread?.id === thread.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {thread.other_participant?.business_name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium truncate">
                              {thread.other_participant?.business_name}
                            </h4>
                            {thread.unread_count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {thread.unread_count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {thread.last_message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(thread.last_message_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredThreads.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No conversations found</p>
                      <p className="text-sm">
                        Start a conversation with a partner
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages */}
          <div className="lg:col-span-2">
            {selectedThread ? (
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedThread.other_participant?.business_name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedThread.other_participant?.business_name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedThread.other_participant?.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.sender_id === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user.id
                                ? 'text-primary-foreground/70'
                                : 'text-muted-foreground'
                            }`}>
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={sending}
                        className="flex-1"
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim() || sending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
