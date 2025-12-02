
import { useState } from "react";
import { Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SIPWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCallActive, setIsCallActive] = useState(false);

  const makeCall = async () => {
    if (!phoneNumber) return;
    
    setIsCallActive(true);
    // Simular llamada
    setTimeout(() => {
      setIsCallActive(false);
      setPhoneNumber("");
    }, 5000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-slate-900 border-2 border-green-500/50 rounded-3xl shadow-2xl p-6 z-50">
          <h3 className="text-xl font-bold text-white mb-4">Llamada VoIP</h3>
          
          {!isCallActive ? (
            <div className="space-y-4">
              <Input
                type="tel"
                placeholder="Número de teléfono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="rounded-2xl"
              />
              <Button 
                onClick={makeCall}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl"
              >
                <Phone className="h-4 w-4 mr-2" />
                Llamar
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <Phone className="h-12 w-12 mx-auto text-green-400" />
              </div>
              <p className="text-white font-bold">Llamando a {phoneNumber}...</p>
              <Button 
                onClick={() => setIsCallActive(false)}
                variant="destructive"
                className="w-full rounded-2xl"
              >
                Colgar
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
