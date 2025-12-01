import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Play, Download, MessageSquare } from "lucide-react";

interface ConversationEmbedProps {
  apiKey: string;
  contactId?: string;
  compact?: boolean;
}

export default function RetellConversationsEmbed({ apiKey, contactId, compact = false }: ConversationEmbedProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/v1/retell/conversations", {
          headers: { "Authorization": `Bearer ${apiKey}` }
        });
        const data = await res.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (apiKey) fetchConversations();
  }, [apiKey]);

  if (loading) {
    return (
      <Card className="rounded-3xl border-2 border-cyan-500/30">
        <CardContent className="pt-6 text-center text-slate-400">Cargando conversaciones...</CardContent>
      </Card>
    );
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {compact ? (
        <Card className="rounded-2xl border-2 border-cyan-500/30 bg-cyan-950/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Phone className="h-4 w-4" />Últimas Llamadas</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1">
              {conversations.slice(0, 3).map(conv => (
                <div key={conv.id} className="text-xs p-2 rounded-lg border-l-2 border-cyan-500 hover:bg-slate-900/50 cursor-pointer">
                  <p className="font-bold text-white">{conv.phoneNumber}</p>
                  <p className="text-slate-400">{Math.round(conv.duration / 60)}m ago</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="rounded-3xl border-2 border-cyan-500/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Panel de Conversaciones Retell</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversations.map(conv => (
                  <div key={conv.id} onClick={() => setSelectedConv(conv)} className="p-4 rounded-2xl border-2 border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-white">{conv.phoneNumber}</p>
                        <p className="text-xs text-slate-400">{new Date(conv.date).toLocaleString()}</p>
                      </div>
                      <Badge className={conv.status === "completed" ? "bg-lime-500/30 text-lime-300 rounded-full" : "bg-blue-500/30 text-blue-300 rounded-full"}>{conv.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{conv.summary}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="rounded-lg text-xs"><Play className="h-3 w-3 mr-1" />Escuchar</Button>
                      <Button size="sm" variant="ghost" className="rounded-lg text-xs"><Download className="h-3 w-3 mr-1" />Descargar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedConv && (
            <Card className="rounded-3xl border-2 border-purple-500/30">
              <CardHeader><CardTitle>Detalles: {selectedConv.phoneNumber}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-slate-900 p-4 rounded-2xl">
                  <h4 className="font-bold text-white mb-2">Transcripción:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-sm">
                    {selectedConv.transcript?.map((line: any, i: number) => (
                      <p key={i} className={line.speaker === "agent" ? "text-cyan-300" : "text-pink-300"}>
                        <span className="font-bold">{line.speaker === "agent" ? "Agente:" : "Cliente:"}</span> {line.text}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 rounded-lg bg-slate-900"><span className="text-slate-400">Duración:</span> <span className="font-bold text-white">{Math.round(selectedConv.duration / 60)}m</span></div>
                  <div className="p-2 rounded-lg bg-slate-900"><span className="text-slate-400">Sentimiento:</span> <span className="font-bold text-green-400">{selectedConv.sentiment}</span></div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
